import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Trash, Globe, Lock, Eye } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import GlassCard from '../ui/GlassCard';
import TagPill from '../ui/TagPill';
import { Bookmark } from '../../types';

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  onPreview: () => void;
  bulkMode?: boolean;
  checked?: boolean;
  onCheck?: () => void;
  viewMode?: 'grid' | 'list';
}

// Memoize the card to prevent unnecessary re-renders
const OptimizedBookmarkCard: React.FC<BookmarkCardProps> = memo(({ 
  bookmark, 
  index, 
  onPreview, 
  bulkMode, 
  checked, 
  onCheck,
  viewMode = 'grid'
}) => {
  const { toggleFavorite, deleteBookmark } = useBookmarks();
  
  // Memoize date formatting
  const formattedDate = React.useMemo(() => {
    const date = new Date(bookmark.createdAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }, [bookmark.createdAt]);

  // Memoize URL formatting
  const displayUrl = React.useMemo(() => {
    return bookmark.url.replace(/^https?:\/\/(www\.)?/, '');
  }, [bookmark.url]);

  // Memoize handlers
  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(bookmark.id);
  }, [bookmark.id, toggleFavorite]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBookmark(bookmark.id);
  }, [bookmark.id, deleteBookmark]);

  const handlePreview = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview();
  }, [onPreview]);

  // Use CSS transforms instead of framer-motion for hover
  return (
    <div className="relative group">
      <GlassCard
        className={`transform transition-all duration-200 group-hover:scale-[1.02] ${
          viewMode === 'grid' 
            ? 'p-4 h-full group-hover:-translate-y-1' 
            : 'p-4 group-hover:-translate-y-0.5'
        }`}
        delay={index}
        animate={index < 8} // Only animate first 8 cards
      >
        {viewMode === 'grid' ? (
          // Grid View Layout
          <>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {bulkMode && (
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={onCheck}
                    className="accent-primary w-4 h-4 rounded mr-2"
                    onClick={e => e.stopPropagation()}
                  />
                )}
                <img
                  src={bookmark.favicon}
                  alt=""
                  className="w-6 h-6 rounded"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdsb2JlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIyIiB5MT0iMTIiIHgyPSIyMiIgeTI9IjEyIi8+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ii8+PC9zdmc+';
                  }}
                />
                <div className="flex items-center gap-1">
                  <span className="text-white/90 text-sm">
                    {bookmark.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                  </span>
                  <span className="text-white/60 text-xs">{bookmark.collection}</span>
                </div>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  className="p-1.5 rounded-full text-white/80 hover:bg-white/10 focus:outline-none transition-colors"
                  onClick={handlePreview}
                  aria-label="Show preview"
                  type="button"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-1.5 rounded-full transition-colors ${bookmark.isFavorite 
                    ? 'text-red-400' 
                    : 'text-white/40 hover:text-white/70'}`}
                >
                  <Heart size={16} fill={bookmark.isFavorite ? 'rgba(248, 113, 113, 1)' : 'none'} />
                </button>
                
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full text-white/40 hover:text-white/70 transition-colors"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="font-semibold text-white mb-1 line-clamp-1">{bookmark.title}</h3>
            
            <a 
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/80 text-sm flex items-center gap-1 mb-2 hover:text-primary transition-colors line-clamp-1"
              onClick={e => e.stopPropagation()}
            >
              {displayUrl}
              <ExternalLink size={12} />
            </a>
            
            <p className="text-white/70 text-sm mb-3 line-clamp-2">
              {bookmark.description}
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              {bookmark.tags.map((tag, i) => (
                <TagPill key={i} tag={tag} />
              ))}
            </div>
            
            <div className="text-white/50 text-xs">
              Added on {formattedDate}
            </div>
          </>
        ) : (
          // List View Layout
          <div className="flex items-center gap-4">
            {bulkMode && (
              <input
                type="checkbox"
                checked={checked}
                onChange={onCheck}
                className="accent-primary w-4 h-4 rounded"
                onClick={e => e.stopPropagation()}
              />
            )}
            
            <img
              src={bookmark.favicon}
              alt=""
              className="w-8 h-8 rounded flex-shrink-0"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdsb2JlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIyIiB5MT0iMTIiIHgyPSIyMiIgeTI9IjEyIi8+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ci8+PC9zdmc+';
              }}
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-white text-lg truncate pr-2">{bookmark.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                  <button
                    className="p-1.5 rounded-full text-white/80 hover:bg-white/10 focus:outline-none transition-colors"
                    onClick={handlePreview}
                    aria-label="Show preview"
                    type="button"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-1.5 rounded-full transition-colors ${bookmark.isFavorite 
                      ? 'text-red-400' 
                      : 'text-white/40 hover:text-white/70'}`}
                  >
                    <Heart size={16} fill={bookmark.isFavorite ? 'rgba(248, 113, 113, 1)' : 'none'} />
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-full text-white/40 hover:text-white/70 transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              
              <a 
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 text-sm flex items-center gap-1 mb-2 hover:text-primary transition-colors truncate"
                onClick={e => e.stopPropagation()}
              >
                {displayUrl}
                <ExternalLink size={12} className="flex-shrink-0" />
              </a>
              
              <p className="text-white/70 text-sm mb-2 line-clamp-1">
                {bookmark.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {bookmark.tags.slice(0, 3).map((tag, i) => (
                    <TagPill key={i} tag={tag} />
                  ))}
                  {bookmark.tags.length > 3 && (
                    <span className="text-white/50 text-xs">+{bookmark.tags.length - 3} more</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-white/50 text-xs flex-shrink-0">
                  <span className="text-white/90 text-sm">
                    {bookmark.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                  </span>
                  <span>{bookmark.collection}</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.bookmark.id === nextProps.bookmark.id &&
    prevProps.bookmark.isFavorite === nextProps.bookmark.isFavorite &&
    prevProps.checked === nextProps.checked &&
    prevProps.bulkMode === nextProps.bulkMode &&
    prevProps.viewMode === nextProps.viewMode
  );
});

OptimizedBookmarkCard.displayName = 'OptimizedBookmarkCard';

export default OptimizedBookmarkCard;
