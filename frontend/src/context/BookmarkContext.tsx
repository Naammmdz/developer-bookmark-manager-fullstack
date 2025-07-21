import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { sampleBookmarks, sampleCollections } from '../data/sampleData';
import { Bookmark, Collection } from '../types';
import { getCollections, addCollection as apiAddCollection, deleteCollection as apiDeleteCollection } from '../api/collectionApi';
import { getBookmarks, addBookmark as apiAddBookmark, deleteBookmark as apiDeleteBookmark, updateBookmark as apiUpdateBookmark } from '../api/bookmarkApi';

// New type for collection with its items
export interface CollectionWithItems extends Omit<Collection, 'id'> {
  id: string;
  count: number;
  items: Bookmark[];
}

// View mode type
export type ViewMode = 'grid' | 'list';

// Updated Context Type
interface BookmarkContextType {
  bookmarks: Bookmark[]; // Still exposing raw bookmarks for potential direct use
  collections: Collection[]; // Original collections array from sampleData
  activeCollection: string; // ID of the active collection (e.g., 'all', 'favorites', 'coll_1')
  setActiveCollection: (collectionId: string) => void;
  collectionData: { [key: string]: CollectionWithItems }; // Processed data for display
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: ViewMode; // Added view mode
  setViewMode: (mode: ViewMode) => void; // Added view mode setter
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleFavorite: (id: number) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  deleteBookmark: (id: number) => void;
  deleteBookmarks: (ids: number[]) => void;
  reorderBookmarks: (movedBookmarkId: number, targetBookmarkId: number | null) => void; // Updated signature
  addCollection: (name: string, icon: string) => void; // Added for adding new collections
  deleteCollection: (collectionId: string) => void; // Added for deleting collections
  isAddCollectionModalOpen: boolean;
  openAddCollectionModal: () => void;
  closeAddCollectionModal: () => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider = ({ children }: BookmarkProviderProps) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  // Initialize with empty array, will be populated from backend
  const [staticCollections, setStaticCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>('all'); // Initialized to 'all'
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); // Added view mode state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // Fetch both bookmarks and collections from the backend for current user
      Promise.all([
        getBookmarks(),
        getCollections()
      ])
        .then(([bookmarksData, collectionsData]) => {
          setBookmarks(bookmarksData);
          setStaticCollections(collectionsData);
        })
        .catch((error) => {
          console.error("Failed to fetch data: ", error);
          // Fallback to sample data if API fails
          setBookmarks(sampleBookmarks);
          const excludedNames = ['All Bookmarks', 'Favorites', 'Recently Added'];
          setStaticCollections(sampleCollections.filter(col => !excludedNames.includes(col.name)));
        });
    } else {
      // Clear data when user logs out
      setBookmarks([]);
      setStaticCollections([]);
    }
  }, [user]);

  const toggleFavorite = async (id: number) => {
    try {
      const bookmark = bookmarks.find(bm => bm.id === id);
      if (!bookmark) return;

      const updatedBookmark = await apiUpdateBookmark(id, { isFavorite: !bookmark.isFavorite });

      setBookmarks(
        bookmarks.map((bm) =>
          bm.id === id
            ? updatedBookmark
            : bm
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // You could add error handling here (e.g., show a toast)
    }
  };

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    try {
      if (user) {
        console.log(`Adding bookmark for user: ${user.email}`);
        // Call backend API to add bookmark
        const newBookmark = await apiAddBookmark(bookmark);
        setBookmarks(prevBookmarks => [newBookmark, ...prevBookmarks]);
      } else {
        console.log('Adding bookmark for guest user (no user logged in).');
        // Fallback for guest users (should not happen in normal flow)
        const newBookmark: Bookmark = {
          ...bookmark,
          id: Math.max(...bookmarks.map(b => b.id), 0) + 1,
          createdAt: new Date().toISOString()
        };
        setBookmarks([newBookmark, ...bookmarks]);
      }
    } catch (error) {
      console.error("Failed to add bookmark:", error);
      // You could add error handling here (e.g., show a toast)
    }
  };

  const deleteBookmark = async (id: number) => {
    try {
      await apiDeleteBookmark(id);
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
      // You could add error handling here (e.g., show a toast)
    }
  };

  const deleteBookmarks = async (ids: number[]) => {
    try {
      // Delete all bookmarks in parallel
      await Promise.all(ids.map(id => apiDeleteBookmark(id)));
      setBookmarks(bookmarks.filter((bookmark) => !ids.includes(bookmark.id)));
    } catch (error) {
      console.error("Failed to delete bookmarks:", error);
      // You could add error handling here (e.g., show a toast)
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openAddCollectionModal = () => setIsAddCollectionModalOpen(true);
  const closeAddCollectionModal = () => setIsAddCollectionModalOpen(false);

  const addCollection = async (name: string, icon: string) => {
    try {
      const newCollection = await apiAddCollection({ name, icon });
      setStaticCollections(prevCollections => [...prevCollections, newCollection]);
    } catch (error) {
      console.error("Failed to add collection:", error);
      // You could add error handling here (e.g., show a toast)
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      // Convert string ID to number for API call
      const numericId = parseInt(collectionId);
      
      // Find the collection to be deleted
      const collectionToDelete = staticCollections.find(col => col.id === numericId);
      
      if (!collectionToDelete) {
        console.warn(`Collection with ID ${collectionId} not found`);
        return;
      }
      
      // Call backend API to delete collection
      await apiDeleteCollection(numericId);
      
      // Remove the collection from staticCollections
      setStaticCollections(prevCollections => 
        prevCollections.filter(col => col.id !== numericId)
      );
      
      // Move bookmarks from deleted collection to "All Bookmarks" and update their collection name
      setBookmarks(prevBookmarks => 
        prevBookmarks.map(bookmark => 
          bookmark.collection === collectionToDelete.name
            ? { ...bookmark, collection: 'Uncategorized' } // Move to a default collection
            : bookmark
        )
      );
      
      // If the deleted collection was active, switch to 'all'
      if (activeCollection === collectionId) {
        setActiveCollection('all');
      }
    } catch (error) {
      console.error("Failed to delete collection:", error);
      // You could add error handling here (e.g., show a toast)
    }
  };

  const collectionData = useMemo(() => {
    const data: { [key: string]: CollectionWithItems } = {};
    const recentLimit = 10;

    // Date-sorted bookmarks, primarily for 'Recently Added'
    const dateSortedBookmarks = [...bookmarks].map(bm => ({ ...bm, parsedCreatedAt: new Date(bm.createdAt) })).filter(bm => !isNaN(bm.parsedCreatedAt.getTime())).sort((a, b) => b.parsedCreatedAt.getTime() - a.parsedCreatedAt.getTime());

    // 'All Bookmarks' Collection - uses original bookmark order
    // Find the icon from sampleCollections for consistency
    const allBookmarksCollection = sampleCollections.find(col => col.name === 'All Bookmarks');
    data['all'] = {
      id: 'all',
      name: 'All Bookmarks',
      icon: allBookmarksCollection?.icon || 'Bookmark',
      items: [...bookmarks], // Use original bookmarks array (maintains user-defined order)
      count: bookmarks.length,
    };

    // 'Favorites' Collection - uses original bookmark order among favorites
    const favoriteItems = bookmarks.filter(bm => bm.isFavorite); // Filter from original bookmarks
    const favoritesCollection = sampleCollections.find(col => col.name === 'Favorites');
    data['favorites'] = {
      id: 'favorites',
      name: 'Favorites',
      icon: favoritesCollection?.icon || 'Heart',
      items: favoriteItems,
      count: favoriteItems.length,
    };

    // 'Recently Added' Collection - uses date-sorted bookmarks
    const recentlyAddedCollection = sampleCollections.find(col => col.name === 'Recently Added');
    data['recently_added'] = {
      id: 'recently_added',
      name: 'Recently Added',
      icon: recentlyAddedCollection?.icon || 'Clock',
      items: dateSortedBookmarks.slice(0, recentLimit), // Uses dateSortedBookmarks
      count: Math.min(dateSortedBookmarks.length, recentLimit), // Based on dateSortedBookmarks
    };

    // Process static collections from sampleCollections - uses original bookmark order within each collection
    staticCollections.forEach(collection => {
      // Filter bookmarks by collection NAME from the original bookmarks array
      const collectionItems = bookmarks.filter(bm => bm.collection === collection.name);
      const key = collection.id.toString();
      data[key] = {
        id: key, // Use the stringified ID as the object's ID
        name: collection.name,
        icon: collection.icon,
        items: collectionItems,
        count: collectionItems.length,
      };
    });

    return data;
  }, [bookmarks, staticCollections]);

  // Reorder bookmarks - this operates on the base `bookmarks` array.
  // `collectionData` will update automatically due to `useMemo` dependency on `bookmarks`.
  const reorderBookmarks = (movedBookmarkId: number, targetBookmarkId: number | null) => {
    setBookmarks(prevBookmarks => {
      const movedItemIndex = prevBookmarks.findIndex(bm => bm.id === movedBookmarkId);
      if (movedItemIndex === -1) {
        console.warn(`reorderBookmarks: movedItem with id ${movedBookmarkId} not found.`);
        return prevBookmarks; // Return original if item not found
      }
      const movedItem = prevBookmarks[movedItemIndex];

      let newBookmarks = prevBookmarks.filter(bm => bm.id !== movedBookmarkId);

      if (targetBookmarkId === null) { // Dropped at the end
        newBookmarks.push(movedItem);
      } else {
        const targetItemIndexInNewArray = newBookmarks.findIndex(bm => bm.id === targetBookmarkId);
        if (targetItemIndexInNewArray !== -1) {
          newBookmarks.splice(targetItemIndexInNewArray, 0, movedItem);
        } else {
          // Fallback: if targetId not found (should ideally not happen if IDs are correct from grid)
          // or if it was the movedItem itself (already filtered out), append to end.
          console.warn(`reorderBookmarks: targetItem with id ${targetBookmarkId} not found in remaining items. Appending to end.`);
          newBookmarks.push(movedItem);
        }
      }
      return newBookmarks;
    });
  };

  const value = {
    bookmarks, // Raw bookmarks
    collections: staticCollections, // Original collection definitions
    activeCollection,
    setActiveCollection,
    collectionData, // New processed data
    searchTerm,
    setSearchTerm,
    viewMode, // Added view mode
    setViewMode, // Added view mode setter
    isModalOpen,
    openModal,
    closeModal,
    toggleFavorite,
    addBookmark,
    deleteBookmark,
    deleteBookmarks,
    reorderBookmarks,
    addCollection, // Added to context value
    deleteCollection, // Added to context value
    isAddCollectionModalOpen,
    openAddCollectionModal,
    closeAddCollectionModal,
    // Removed: filteredBookmarks, selectedTag, setSelectedTag, selectedDateRange, setSelectedDateRange, availableTags
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};