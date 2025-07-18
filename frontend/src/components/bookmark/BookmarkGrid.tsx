import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
// useBookmarks removed, functionality will come from props
import OptimizedBookmarkCard from './OptimizedBookmarkCard';
// FolderOpen removed as empty state is handled by parent
import {
  DndContext,
  closestCenter,
  closestCorners,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  CollisionDetection,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GlassCard from '../ui/GlassCard';
import { Bookmark } from '../../types'; // Import Bookmark type for props

interface BookmarkPreviewModalProps {
  bookmark: Bookmark; // Use Bookmark type
  onClose: () => void;
}

const BookmarkPreviewModal: React.FC<BookmarkPreviewModalProps> = ({ bookmark, onClose }) => {
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Helper function to convert URLs to embeddable format or detect special handling
  const getEmbeddableUrl = (url: string): string => {
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    }
    
    // Handle other video platforms that support embedding
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId && !isNaN(parseInt(videoId))) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    
    // Handle CodePen
    if (url.includes('codepen.io/')) {
      // Convert CodePen URLs to embed format
      const embedUrl = url.replace('/pen/', '/embed/');
      return embedUrl.includes('/embed/') ? embedUrl : url;
    }
    
    // Handle JSFiddle
    if (url.includes('jsfiddle.net/')) {
      return url.endsWith('/') ? url + 'embedded/' : url + '/embedded/';
    }
    
    // Return original URL for other sites
    return url;
  };
  
  // Check if URL is a known blocked site that needs special handling
  const isKnownBlockedSite = (url: string): boolean => {
    const blockedDomains = [
      'github.com',
      'gitlab.com',
      'facebook.com',
      'twitter.com',
      'x.com',
      'linkedin.com',
      'instagram.com',
      'reddit.com'
    ];
    
    return blockedDomains.some(domain => url.includes(domain));
  };
  
  // Get GitHub-specific information for better display
  const getGitHubInfo = (url: string): { type: string; info: string } | null => {
    if (!url.includes('github.com')) return null;
    
    const urlParts = url.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];
    
    if (urlParts.length >= 2) {
      if (urlParts.length === 2) {
        return { type: 'Repository', info: `${owner}/${repo}` };
      } else if (urlParts[2] === 'issues') {
        return { type: 'Issues', info: `${owner}/${repo}` };
      } else if (urlParts[2] === 'pull' || urlParts[2] === 'pulls') {
        return { type: 'Pull Requests', info: `${owner}/${repo}` };
      } else if (urlParts[2] === 'blob' || urlParts[2] === 'tree') {
        return { type: 'Code', info: `${owner}/${repo}` };
      } else if (urlParts[2] === 'releases') {
        return { type: 'Releases', info: `${owner}/${repo}` };
      }
    }
    
    return { type: 'GitHub', info: url.replace('https://github.com/', '') };
  };

  const embeddableUrl = getEmbeddableUrl(bookmark.url);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsBlocked(true);
    setIsLoading(false);
  };

  const openInNewTab = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  // Check if this is a known blocked site and skip iframe attempt
  React.useEffect(() => {
    if (isKnownBlockedSite(bookmark.url)) {
      setIsBlocked(true);
      setIsLoading(false);
      return;
    }
    
    // Set a timeout to detect if iframe is blocked for other sites
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsBlocked(true);
        setIsLoading(false);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timer);
  }, [isLoading, bookmark.url]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <GlassCard className="relative w-full max-w-xl h-screen max-h-[80vh] flex items-center justify-center animate-fade-in overflow-hidden">
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 z-10"
          onClick={onClose}
          aria-label="Close preview"
          type="button"
        >
          ✕
        </button>
        
        {isBlocked ? (
          <div className="flex flex-col items-center justify-center text-center p-8 text-white">
            {(() => {
              const githubInfo = getGitHubInfo(bookmark.url);
              
              if (githubInfo) {
                return (
                  <>
                    <div className="mb-4">
                      <svg className="w-16 h-16 text-white/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{githubInfo.type}</h3>
                    <p className="text-white/90 font-medium mb-2">{githubInfo.info}</p>
                    <p className="text-white/70 mb-6 max-w-sm">
                      GitHub repositories can't be embedded directly for security reasons.
                    </p>
                  </>
                );
              }
              
              return (
                <>
                  <div className="mb-4">
                    <svg className="w-16 h-16 text-white/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Preview Blocked</h3>
                  <p className="text-white/70 mb-6 max-w-sm">
                    This website prevents preview embedding for security reasons.
                  </p>
                </>
              );
            })()}
            
            <div className="space-y-3 w-full max-w-sm">
              <button
                onClick={openInNewTab}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in New Tab
              </button>
              
              {getGitHubInfo(bookmark.url) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(bookmark.url + '#readme', '_blank', 'noopener,noreferrer')}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    README
                  </button>
                  <button
                    onClick={() => window.open(bookmark.url + '/issues', '_blank', 'noopener,noreferrer')}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Issues
                  </button>
                  <button
                    onClick={() => window.open(bookmark.url + '/pulls', '_blank', 'noopener,noreferrer')}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    PRs
                  </button>
                </div>
              )}
              
              <div className="text-sm text-white/50">
                <span className="font-medium">{bookmark.title}</span>
                <br />
                <span className="break-all">{bookmark.url}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                <div className="text-white/70">Loading preview...</div>
              </div>
            )}
            <iframe
              src={embeddableUrl}
              title={bookmark.title || "Bookmark Preview"}
              className="w-full h-full border-0 bg-white rounded-2xl"
              sandbox="allow-scripts allow-popups allow-same-origin allow-forms allow-top-navigation-by-user-activation"
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </>
        )}
      </GlassCard>
    </div>
  );
};

// Sortable Bookmark Item Component
interface SortableBookmarkItemProps {
  bookmark: Bookmark;
  index: number;
  onPreview: () => void;
  bulkMode: boolean;
  checked: boolean;
  onCheck: () => void;
  viewMode: 'grid' | 'list';
  onBookmarkClick?: (bookmark: Bookmark) => void;
}

const SortableBookmarkItem: React.FC<SortableBookmarkItemProps> = ({
  bookmark,
  index,
  onPreview,
  bulkMode,
  checked,
  onCheck,
  viewMode,
  onBookmarkClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ 
    id: bookmark.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    transformOrigin: 'center',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-102'} 
        transition-all duration-200 ease-out
        ${isSorting ? 'z-10' : ''}
        ${isDragging ? 'shadow-2xl' : ''}
      `}
    >
      <OptimizedBookmarkCard
        bookmark={bookmark}
        index={index}
        onPreview={onPreview}
        bulkMode={bulkMode}
        checked={checked}
        onCheck={onCheck}
        viewMode={viewMode}
        onBookmarkClick={onBookmarkClick}
      />
    </div>
  );
};

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  reorderBookmarks: (movedBookmarkId: number, targetBookmarkId: number | null) => void; // Updated signature
  deleteBookmarks: (ids: number[]) => void;
  viewMode: 'grid' | 'list'; // Added viewMode prop
  onBookmarkClick?: (bookmark: Bookmark) => void; // Added onBookmarkClick prop
  // activeCollection is not needed here anymore as parent handles empty state based on it
}

const BookmarkGrid: React.FC<BookmarkGridProps> = ({ bookmarks, reorderBookmarks, deleteBookmarks, viewMode, onBookmarkClick }) => {
  const [previewBookmark, setPreviewBookmark] = useState<Bookmark | null>(null); // Typed state
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleBulkMode = () => {
    setBulkMode((v) => !v);
    setSelectedIds([]);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const activeBookmark = activeId ? bookmarks.find((bookmark) => bookmark.id === activeId) : null;

  // Empty state is now handled by the parent component (BookmarksViewWithSidebar)
  // The `if (bookmarks.length === 0)` block has been removed.

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${bulkMode ? 'bg-primary/80 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          onClick={toggleBulkMode}
        >
          {bulkMode ? 'Cancel Bulk Select' : 'Bulk Select'}
        </button>
        {bulkMode && selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm">{selectedIds.length} selected</span>
            <button
              className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              onClick={() => {
                deleteBookmarks(selectedIds); // This function is now passed as a prop
                setSelectedIds([]);
              }}
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>
      <SortableContext
        items={bookmarks.map((bookmark) => bookmark.id)}
        strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
      >
          <div
            className={`w-full ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' 
                : 'flex flex-col gap-3'
            }`}
          >
            {bookmarks.map((bookmark, index) => (
              <SortableBookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                index={index}
                onPreview={() => setPreviewBookmark(bookmark)}
                bulkMode={bulkMode}
                checked={selectedIds.includes(bookmark.id)}
                onCheck={() => toggleSelect(bookmark.id)}
                viewMode={viewMode}
                onBookmarkClick={onBookmarkClick}
              />
            ))}
          </div>
        </SortableContext>
      {previewBookmark && (
        // The onClick on this div might be too broad, consider if it should be on a specific backdrop element
        <div onClick={() => setPreviewBookmark(null)}>
          <BookmarkPreviewModal bookmark={previewBookmark} onClose={() => setPreviewBookmark(null)} />
        </div>
      )}
    </>
  );
};

export default BookmarkGrid;