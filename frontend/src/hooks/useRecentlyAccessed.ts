import { useState, useEffect } from 'react';
import { Bookmark } from '../types';

const STORAGE_KEY = 'recently_accessed_bookmarks';
const MAX_RECENT_ITEMS = 10;

interface RecentBookmark {
  id: number;
  title: string;
  url: string;
  accessedAt: string;
}

export const useRecentlyAccessed = () => {
  const [recentlyAccessed, setRecentlyAccessed] = useState<RecentBookmark[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentlyAccessed(parsed);
      }
    } catch (error) {
      console.error('Failed to load recently accessed bookmarks:', error);
    }
  }, []);

  // Save to localStorage whenever recentlyAccessed changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyAccessed));
    } catch (error) {
      console.error('Failed to save recently accessed bookmarks:', error);
    }
  }, [recentlyAccessed]);

  const addRecentlyAccessed = (bookmark: Bookmark) => {
    const recentItem: RecentBookmark = {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      accessedAt: new Date().toISOString()
    };

    setRecentlyAccessed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.id !== bookmark.id);
      
      // Add to beginning and limit to MAX_RECENT_ITEMS
      return [recentItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    });
  };

  const clearRecentlyAccessed = () => {
    setRecentlyAccessed([]);
  };

  return {
    recentlyAccessed,
    addRecentlyAccessed,
    clearRecentlyAccessed
  };
};
