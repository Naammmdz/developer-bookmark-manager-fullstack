import React, { createContext, useContext, useState, useEffect } from 'react';
import { CodeBlock } from '../types';
import { useBookmarks } from './BookmarkContext';
import * as codeBlockApi from '../api/codeBlockApi';
import { useAuth } from './AuthContext';

interface CodeBlockContextType {
  codeBlocks: CodeBlock[];
  isModalOpen: boolean;
  activeCollection: string;
  searchTerm: string;
  
  // Modal management
  openModal: () => void;
  closeModal: () => void;
  
  // Code block management
  addCodeBlock: (codeBlock: Omit<CodeBlock, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCodeBlock: (id: number, updates: Partial<CodeBlock>) => void;
  deleteCodeBlock: (id: string) => void;
  toggleFavorite: (id: number) => void;
  
  // Filtering and searching
  setActiveCollection: (collection: string) => void;
  setSearchTerm: (term: string) => void;
  
  // Filtered results
  filteredCodeBlocks: CodeBlock[];
  
  // Collections - now using bookmark collections
  collections: { name: string; count: number }[];
}

const CodeBlockContext = createContext<CodeBlockContextType | undefined>(undefined);

export const useCodeBlocks = () => {
  const context = useContext(CodeBlockContext);
  if (!context) {
    throw new Error('useCodeBlocks must be used within a CodeBlockProvider');
  }
  return context;
};

export const CodeBlockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState('All Code Blocks');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get bookmark collections to use for code blocks
  const { collections: bookmarkCollections } = useBookmarks();
  const { user } = useAuth();

  // Load code blocks from the backend on mount
  useEffect(() => {
    console.log('CodeBlockContext: useEffect triggered');
    console.log('CodeBlockContext: user:', user);
    const token = localStorage.getItem('token');
    console.log('CodeBlockContext: token:', token ? 'present' : 'missing');
    
    if (!user || !token) {
      console.log('CodeBlockContext: Not authenticated or no token - skipping fetch');
      return;
    }
    
    const fetchCodeBlocks = async () => {
      try {
        console.log('CodeBlockContext: Starting to fetch code blocks...');
        console.log('CodeBlockContext: API URL will be:', `${import.meta.env.VITE_API_URL}/codeblocks`);
        const data = await codeBlockApi.getCodeBlocks();
        console.log('CodeBlockContext: Successfully fetched code blocks:', data);
        console.log('CodeBlockContext: Number of code blocks:', data.length);
        setCodeBlocks(data);
      } catch (error: any) {
        console.error('CodeBlockContext: Error fetching code blocks:', error);
        console.error('CodeBlockContext: Error message:', error?.message);
        console.error('CodeBlockContext: Error response:', error?.response);
        console.error('CodeBlockContext: Error response status:', error?.response?.status);
        console.error('CodeBlockContext: Error response data:', error?.response?.data);
      }
    };
    fetchCodeBlocks();
  }, [user]);

  // Modal management
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Code block management
  const addCodeBlock = async (codeBlockData: Omit<CodeBlock, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('CodeBlockContext: Adding code block:', codeBlockData);
      const newCodeBlock = await codeBlockApi.addCodeBlock(codeBlockData);
      console.log('CodeBlockContext: Added code block successfully:', newCodeBlock);
      setCodeBlocks(prev => {
        const updated = [newCodeBlock, ...prev];
        console.log('CodeBlockContext: Updated code blocks:', updated);
        return updated;
      });
    } catch (error) {
      console.error('Error adding code block:', error);
    }
  };

  const updateCodeBlock = async (id: number, updates: Partial<CodeBlock>) => {
    try {
      const updatedCodeBlock = await codeBlockApi.updateCodeBlock(id, updates as Omit<CodeBlock, 'id' | 'createdAt' | 'updatedAt'>);
      setCodeBlocks(prev => prev.map(cb => 
        cb.id === id ? updatedCodeBlock : cb
      ));
    } catch (error) {
      console.error('Error updating code block:', error);
    }
  };

  const deleteCodeBlock = async (id: string) => {
    try {
      const numericId = parseInt(id);
      await codeBlockApi.deleteCodeBlock(numericId);
      setCodeBlocks(prev => prev.filter(cb => cb.id !== numericId));
    } catch (error) {
      console.error('Error deleting code block:', error);
    }
  };

  const toggleFavorite = async (id: number) => {
    try {
      const updatedCodeBlock = await codeBlockApi.toggleFavoriteCodeBlock(id);
      setCodeBlocks(prev => prev.map(cb => 
        cb.id === id ? updatedCodeBlock : cb
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Get filtered code blocks
  const filteredCodeBlocks = React.useMemo(() => {
    let filtered = codeBlocks;

    // Filter by collection
    if (activeCollection !== 'All Code Blocks') {
      if (activeCollection === 'Favorites') {
        filtered = filtered.filter(cb => cb.isFavorite);
      } else if (activeCollection === 'Recently Added') {
        filtered = filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        filtered = filtered.filter(cb => cb.collection === activeCollection);
      }
    }

    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(cb => 
        cb.title.toLowerCase().includes(lowercaseSearch) ||
        cb.description?.toLowerCase().includes(lowercaseSearch) ||
        cb.language.toLowerCase().includes(lowercaseSearch) ||
        cb.code.toLowerCase().includes(lowercaseSearch) ||
        cb.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch))
      );
    }

    return filtered;
  }, [codeBlocks, activeCollection, searchTerm]);

  // Get collections with counts - now using bookmark collections
  const collections = React.useMemo(() => {
    const collectionCounts: { [key: string]: number } = {};
    
    // Count code blocks by collection
    codeBlocks.forEach(cb => {
      collectionCounts[cb.collection] = (collectionCounts[cb.collection] || 0) + 1;
    });

    // Use bookmark collections as the base, but show counts for code blocks
    const regularCollections = bookmarkCollections.map(collection => ({
      name: collection.name,
      count: collectionCounts[collection.name] || 0,
    }));

    return [
      { name: 'All Code Blocks', count: codeBlocks.length },
      { name: 'Favorites', count: codeBlocks.filter(cb => cb.isFavorite).length },
      { name: 'Recently Added', count: codeBlocks.length },
      ...regularCollections,
    ];
  }, [codeBlocks, bookmarkCollections]);

  const value: CodeBlockContextType = {
    codeBlocks,
    isModalOpen,
    activeCollection,
    searchTerm,
    openModal,
    closeModal,
    addCodeBlock,
    updateCodeBlock,
    deleteCodeBlock,
    toggleFavorite,
    setActiveCollection,
    setSearchTerm,
    filteredCodeBlocks,
    collections,
  };

  return (
    <CodeBlockContext.Provider value={value}>
      {children}
    </CodeBlockContext.Provider>
  );
};
