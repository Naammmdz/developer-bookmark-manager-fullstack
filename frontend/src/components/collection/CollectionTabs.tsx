import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Hash, PlusCircle, ListPlus } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useCodeBlocks } from '../../context/CodeBlockContext';
import { useRecentlyAccessed } from '../../hooks/useRecentlyAccessed';
import BookmarkGrid from '../bookmark/BookmarkGrid';
import CodeBlockGrid from '../codeblock/CodeBlockGrid';
import { Bookmark as BookmarkType, CodeBlock as CodeBlockType } from '../../types';

interface CollectionTabsProps {
  collectionId: string;
  collectionName: string;
  collectionIcon: string;
  searchTerm: string;
  viewMode: 'grid' | 'list';
  onOpenBookmarkModal: () => void;
  onOpenCodeBlockModal: () => void;
  onEditCodeBlock?: (codeBlock: CodeBlockType) => void;
}

const CollectionTabs: React.FC<CollectionTabsProps> = ({
  collectionId,
  collectionName,
  collectionIcon,
  searchTerm,
  viewMode,
  onOpenBookmarkModal,
  onOpenCodeBlockModal,
  onEditCodeBlock,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'codeblocks'>('bookmarks');
  
  const {
    collectionData,
    reorderBookmarks,
    deleteBookmarks,
  } = useBookmarks();
  
  const {
    codeBlocks,
    toggleFavorite,
    deleteCodeBlock,
  } = useCodeBlocks();
  
  const { addRecentlyAccessed } = useRecentlyAccessed();

  // Get current collection data
  const currentCollection = collectionData?.[collectionId];
  const bookmarks = currentCollection?.items || [];
  
  // Filter bookmarks based on search term
  const filteredBookmarks = searchTerm.trim() === ''
    ? bookmarks
    : bookmarks.filter((bookmark) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          bookmark.title.toLowerCase().includes(searchTermLower) ||
          (bookmark.description &&
            bookmark.description.toLowerCase().includes(searchTermLower)) ||
          bookmark.tags.some((tag) =>
            tag.toLowerCase().includes(searchTermLower)
          )
        );
      });

  // Filter and sort code blocks by collection and search term
  let filteredCodeBlocks = codeBlocks.filter((codeBlock) => {
    // For "All Resources" collection, show all code blocks
    if (collectionId === 'all') {
      return true;
    }
    
    // For "Favorites" collection, show only favorite code blocks
    if (collectionId === 'favorites') {
      if (!codeBlock.isFavorite) return false;
      
      // Apply search filter if there's a search term
      if (searchTerm.trim() === '') return true;
      
      const searchTermLower = searchTerm.toLowerCase();
      return (
        codeBlock.title.toLowerCase().includes(searchTermLower) ||
        (codeBlock.description &&
          codeBlock.description.toLowerCase().includes(searchTermLower)) ||
        codeBlock.language.toLowerCase().includes(searchTermLower) ||
        codeBlock.code.toLowerCase().includes(searchTermLower) ||
        codeBlock.tags.some((tag) =>
          tag.toLowerCase().includes(searchTermLower)
        )
      );
    }
    
    // For "Recently Added" collection, show all code blocks (they will be sorted by date)
    if (collectionId === 'recently_added') {
      // Apply search filter if there's a search term
      if (searchTerm.trim() === '') return true;
      
      const searchTermLower = searchTerm.toLowerCase();
      return (
        codeBlock.title.toLowerCase().includes(searchTermLower) ||
        (codeBlock.description &&
          codeBlock.description.toLowerCase().includes(searchTermLower)) ||
        codeBlock.language.toLowerCase().includes(searchTermLower) ||
        codeBlock.code.toLowerCase().includes(searchTermLower) ||
        codeBlock.tags.some((tag) =>
          tag.toLowerCase().includes(searchTermLower)
        )
      );
    }
    
    // Match by collection name instead of collection_id
    // First, we need to get the collection name from the collectionId
    const targetCollection = collectionData?.[collectionId];
    const targetCollectionName = targetCollection?.name;
    
    const matchesCollection = codeBlock.collection === targetCollectionName;
    if (!matchesCollection) return false;
    
    if (searchTerm.trim() === '') return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      codeBlock.title.toLowerCase().includes(searchTermLower) ||
      (codeBlock.description &&
        codeBlock.description.toLowerCase().includes(searchTermLower)) ||
      codeBlock.language.toLowerCase().includes(searchTermLower) ||
      codeBlock.code.toLowerCase().includes(searchTermLower) ||
      codeBlock.tags.some((tag) =>
        tag.toLowerCase().includes(searchTermLower)
      )
    );
  });
  
  // Sort by date for "Recently Added" collection
  if (collectionId === 'recently_added') {
    filteredCodeBlocks = filteredCodeBlocks.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Most recent first
    });
  }

  const bookmarkCount = filteredBookmarks.length;
  const codeBlockCount = filteredCodeBlocks.length;

  const handleTabChange = (tab: 'bookmarks' | 'codeblocks') => {
    setActiveTab(tab);
  };

  const handleCodeBlockClick = (codeBlock: CodeBlockType) => {
    // Handle code block click if needed
    console.log('Code block clicked:', codeBlock.title);
  };

  const handleEditCodeBlock = (codeBlock: CodeBlockType) => {
    if (onEditCodeBlock) {
      onEditCodeBlock(codeBlock);
    }
  };

  const handleDeleteCodeBlock = (id: string) => {
    deleteCodeBlock(id);
  };

  const renderEmptyState = () => {
    const isBookmarksTab = activeTab === 'bookmarks';
    const hasItems = isBookmarksTab ? bookmarkCount > 0 : codeBlockCount > 0;
    
    if (hasItems) return null;

    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
        <PlusCircle size={48} className="mx-auto text-white/30 mb-4" />
        <h3 className="text-xl font-semibold text-white/80 mb-2">
          {searchTerm
            ? `No ${isBookmarksTab ? 'Bookmarks' : 'Code Blocks'} Match Your Search`
            : `No ${isBookmarksTab ? 'Bookmarks' : 'Code Blocks'} Yet`}
        </h3>
        <p className="text-white/50 mb-6 max-w-md">
          {searchTerm
            ? `Try refining your search term or clearing it to see all ${isBookmarksTab ? 'bookmarks' : 'code blocks'} in "${collectionName}".`
            : `Add some ${isBookmarksTab ? 'bookmarks' : 'code blocks'} to "${collectionName}" to see them here.`}
        </p>
        {!searchTerm && (
          <button
            onClick={isBookmarksTab ? onOpenBookmarkModal : onOpenCodeBlockModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg flex items-center mx-auto text-sm transition-colors"
          >
            <ListPlus size={18} className="mr-2" />
            Add {isBookmarksTab ? 'Bookmark' : 'Code Block'} to "{collectionName}"
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Tab Navigation */}
      <div className="px-6 pt-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-1">
              <button
                onClick={() => handleTabChange('bookmarks')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'bookmarks'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Bookmark size={16} />
                Bookmarks
                {bookmarkCount > 0 && (
                  <span className="bg-white/20 text-white/90 text-xs px-2 py-0.5 rounded-full">
                    {bookmarkCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleTabChange('codeblocks')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'codeblocks'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Hash size={16} />
                Code Blocks
                {codeBlockCount > 0 && (
                  <span className="bg-white/20 text-white/90 text-xs px-2 py-0.5 rounded-full">
                    {codeBlockCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={activeTab === 'bookmarks' ? onOpenBookmarkModal : onOpenCodeBlockModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg flex items-center text-sm transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              Add {activeTab === 'bookmarks' ? 'Bookmark' : 'Code Block'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-6 flex-1 flex flex-col">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {activeTab === 'bookmarks' ? (
            filteredBookmarks.length === 0 ? (
              renderEmptyState()
            ) : (
              <BookmarkGrid
                bookmarks={filteredBookmarks}
                reorderBookmarks={reorderBookmarks}
                deleteBookmarks={deleteBookmarks}
                viewMode={viewMode}
                onBookmarkClick={addRecentlyAccessed}
              />
            )
          ) : (
            filteredCodeBlocks.length === 0 ? (
              renderEmptyState()
            ) : (
              <CodeBlockGrid
                codeBlocks={filteredCodeBlocks}
                onToggleFavorite={toggleFavorite}
                onEdit={handleEditCodeBlock}
                onDelete={handleDeleteCodeBlock}
                onCodeBlockClick={handleCodeBlockClick}
                viewMode={viewMode}
              />
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CollectionTabs;
