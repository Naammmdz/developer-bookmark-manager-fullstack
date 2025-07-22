import React, { useState, useEffect } from 'react';
import { X, Filter, RefreshCw, Check } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterParams) => void;
  currentFilters: FilterParams;
}

export interface FilterParams {
  title?: string;
  url?: string;
  isFavorite?: boolean;
  tag?: string;
  sortBy?: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterParams>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterParams = {
      title: '',
      url: '',
      isFavorite: undefined,
      tag: '',
      sortBy: 'createdAt,desc'
    };
    setFilters(resetFilters);
    onApplyFilter(resetFilters);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleOverlayClick}>
      <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Filter Bookmarks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Filter Form */}
        <div className="space-y-4">
          {/* Title Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title Contains
            </label>
            <input
              type="text"
              value={filters.title || ''}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              placeholder="Search by title..."
            />
          </div>

          {/* URL Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              URL Contains
            </label>
            <input
              type="text"
              value={filters.url || ''}
              onChange={(e) => setFilters({ ...filters, url: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              placeholder="Search by URL..."
            />
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tag
            </label>
            <input
              type="text"
              value={filters.tag || ''}
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              placeholder="Filter by tag..."
            />
          </div>

          {/* Favorite Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Favorite Status
            </label>
            <select
              value={filters.isFavorite === undefined ? '' : filters.isFavorite.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({ 
                  ...filters, 
                  isFavorite: value === '' ? undefined : value === 'true' 
                });
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            >
              <option value="">All</option>
              <option value="true">Favorites Only</option>
              <option value="false">Non-Favorites Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy || 'createdAt,desc'}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            >
              <option value="createdAt,desc">Newest First</option>
              <option value="createdAt,asc">Oldest First</option>
              <option value="title,asc">Title A-Z</option>
              <option value="title,desc">Title Z-A</option>
              <option value="updatedAt,desc">Recently Updated</option>
              <option value="updatedAt,asc">Least Recently Updated</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex-1"
          >
            <Check size={16} />
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
