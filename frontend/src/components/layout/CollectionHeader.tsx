import React from 'react';
import { motion } from 'framer-motion';
import { useBookmarks } from '../../context/BookmarkContext';
import { CustomIcon } from '../../utils/iconMapping';

const CollectionHeader: React.FC = () => {
  const { activeCollection, collectionData } = useBookmarks();
  
  // Get the active collection data
  const activeCollectionData = collectionData[activeCollection];
  
  if (!activeCollectionData) {
    return null;
  }
  
  
  // Get color class based on collection ID
  const getCollectionColor = (collectionId: string) => {
    const colorMap: { [key: string]: string } = {
      'all': 'text-primary',
      'favorites': 'text-red-400',
      'recently_added': 'text-purple-400'
    };
    
    // For user collections, cycle through some colors
    const colors = ['text-secondary', 'text-blue-400', 'text-accent', 'text-yellow-400', 'text-green-400', 'text-pink-400'];
    if (!colorMap[collectionId]) {
      // Use a simple hash to consistently assign colors to collections
      const hash = collectionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    }
    
    return colorMap[collectionId];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3">
        <CustomIcon 
          icon={activeCollectionData.icon} 
          size={24} 
          className={getCollectionColor(activeCollection)} 
        />
        <div>
          <h2 className="text-2xl font-bold text-white">{activeCollectionData.name}</h2>
          <p className="text-white/60">
            {activeCollectionData.count} bookmark{activeCollectionData.count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionHeader;