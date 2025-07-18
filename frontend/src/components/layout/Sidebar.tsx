import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useBookmarks, CollectionWithItems } from '../../context/BookmarkContext'; // Import CollectionWithItems
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Trash2, MoreVertical, Shield } from 'lucide-react'; // Added for the "Add Collection" button
import { CustomIcon } from '../../utils/iconMapping';

// Define SidebarItemProps and SidebarItem inline functional component
import { useDroppable } from '@dnd-kit/core';

interface SidebarItemProps {
  id: string;
  icon: string; // Emoji or simple character
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  isStaticCollection?: boolean; // Flag to manage transition delays differently
  itemIndex?: number; // Added for improved animation delay calculation
  onDelete?: () => void; // Optional delete handler for user collections
  isDeletable?: boolean; // Flag to show delete option
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, icon, name, count, isActive, onClick, isStaticCollection, itemIndex, onDelete, isDeletable }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id: `collection-${id}` });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete?.();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      ref={setNodeRef} 
      key={id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: isStaticCollection && typeof itemIndex === 'number' ? 0.1 + (itemIndex * 0.03) : 0 }}
      className="relative group"
    >
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ease-in-out
                    ${isActive
                      ? 'bg-primary/20 text-primary font-medium border border-primary/30'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}
                    ${isOver ? 'bg-primary/40 border-primary/60 border-2 scale-110 shadow-lg shadow-primary/20' : ''}`}
      >
        <CustomIcon icon={icon} size={20} className="w-5 h-5 flex items-center justify-center" />
        <span className="flex-1 truncate text-sm font-medium">{name}</span>
        {/* Show badge count for all items */}
        {count > 0 && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono
                           ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {count}
          </span>
        )}
      </button>
      
      {/* Delete button for deletable items - positioned to the left of badge count */}
      {isDeletable && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {showDeleteConfirm ? (
            <div className="flex gap-1">
              <button
                onClick={handleDelete}
                className="p-1 rounded bg-red-500/80 text-white text-xs hover:bg-red-600 transition-colors"
                title="Confirm delete"
              >
                ✓
              </button>
              <button
                onClick={handleCancelDelete}
                className="p-1 rounded bg-gray-500/80 text-white text-xs hover:bg-gray-600 transition-colors"
                title="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Delete collection"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};


const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    activeCollection,
    setActiveCollection,
    collectionData,
    collections: staticCollections, // Renamed for clarity, this is sampleCollections
    openAddCollectionModal, // Destructure openAddCollectionModal, remove addCollection
    deleteCollection // Add deleteCollection function
  } = useBookmarks();

  // handleAddNewCollection (using window.prompt) is now removed.

  // Ensure collectionData is available
  if (!collectionData || Object.keys(collectionData).length === 0) {
    return (
      <motion.aside className="hidden md:block">
        <div className="h-full flex flex-col p-6 items-center justify-center">
          <p className="text-white/50">Loading collections...</p>
        </div>
      </motion.aside>
    );
  }

  const allData = collectionData['all'];
  const favoritesData = collectionData['favorites'];
  const recentlyAddedData = collectionData['recently_added'];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }} // Adjusted main aside transition
      className="hidden md:block"
    >
      <div className="h-full flex flex-col">
        {/* Scrollable Collections Area */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto"> {/* Reduced padding, added space-y-1 */}
          {allData && (
            <SidebarItem
              id="all"
              icon={allData.icon}
              name={allData.name}
              count={allData.count}
              isActive={activeCollection === 'all'}
              onClick={() => setActiveCollection('all')}
            />
          )}

          <div className="flex items-center justify-between pt-2 pb-1 px-3 mb-1">
            <h2 className="text-xs text-white/40 font-semibold uppercase">My Collections</h2>
            <button
              onClick={openAddCollectionModal} // Changed to open the modal
              className="text-primary/80 hover:text-primary p-0.5 rounded-full hover:bg-primary/10 transition-colors"
              title="Add new collection"
            >
              <PlusCircle size={16} />
            </button>
          </div>
          {staticCollections.map((sColl, index) => {
            const data = collectionData[sColl.id];
            if (!data) return null; // Skip if data for this static collection isn't in collectionData
            
            // Check if this collection can be deleted (not a default collection)
            const isDeletable = !sColl.isDefault;
            
            return (
              <SidebarItem
                key={sColl.id} // Use sColl.id for key as it's from the map
                id={sColl.id.toString()}
                icon={sColl.icon} // Use sColl.icon for the specific collection
                name={sColl.name} // Use sColl.name for consistency from static definition
                count={data.count}
                isActive={activeCollection === sColl.id.toString()}
                onClick={() => setActiveCollection(sColl.id.toString())}
                isStaticCollection={true} // For staggered animation
                itemIndex={index} // Pass the index as itemIndex
                isDeletable={isDeletable} // Use isDefault property to determine if deletable
                onDelete={() => deleteCollection(sColl.id.toString())}
              />
            );
          })}
        </div>

        {/* Quick Access Area */}
        <div className="p-4 border-t border-white/10 space-y-1"> {/* Reduced padding, added space-y-1 */}
           <div className="pt-1 pb-1">
            <h2 className="text-xs text-white/40 font-semibold uppercase px-3 mb-1">Quick Access</h2>
          </div>
          {favoritesData && (
            <SidebarItem
              id="favorites"
              icon={favoritesData.icon}
              name={favoritesData.name}
              count={favoritesData.count}
              isActive={activeCollection === 'favorites'}
              onClick={() => setActiveCollection('favorites')}
            />
          )}
          {recentlyAddedData && (
            <SidebarItem
              id="recently_added"
              icon={recentlyAddedData.icon}
              name={recentlyAddedData.name}
              count={recentlyAddedData.count}
              isActive={activeCollection === 'recently_added'}
              onClick={() => setActiveCollection('recently_added')}
            />
          )}
        </div>
        
        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="p-4 border-t border-white/10">
            <div className="pt-1 pb-1">
              <h2 className="text-xs text-white/40 font-semibold uppercase px-3 mb-1">Admin</h2>
            </div>
            <Link
              to="/app/admin"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ease-in-out ${
                location.pathname.startsWith('/app/admin')
                  ? 'bg-primary/20 text-primary font-medium border border-primary/30'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <Shield size={20} className="w-5 h-5" />
              <span className="flex-1 text-sm font-medium">User Management</span>
            </Link>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;