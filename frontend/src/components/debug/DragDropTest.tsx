import React from 'react';
import { useBookmarks } from '../../context/BookmarkContext';

export const DragDropTest: React.FC = () => {
  const { bookmarks, collections, collectionData, moveBookmarkToCollection } = useBookmarks();

  const handleTestMove = () => {
    if (bookmarks.length > 0 && collections.length > 0) {
      console.log('Available bookmarks:', bookmarks.map(b => ({ id: b.id, title: b.title, collection: b.collection })));
      console.log('Available collections:', collections.map(c => ({ id: c.id, name: c.name })));
      console.log('Collection data:', collectionData);
      
      // Try to move the first bookmark to the second collection
      const firstBookmark = bookmarks[0];
      const targetCollection = collections.find(c => c.id !== 1); // Not "All Bookmarks"
      
      if (firstBookmark && targetCollection) {
        console.log(`Testing move: bookmark ${firstBookmark.id} to collection ${targetCollection.id}`);
        moveBookmarkToCollection(firstBookmark.id, targetCollection.id.toString());
      }
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg m-4">
      <h3 className="text-lg font-bold mb-2">Drag & Drop Debug</h3>
      <p>Bookmarks: {bookmarks.length}</p>
      <p>Collections: {collections.length}</p>
      <p>Collection Data Keys: {Object.keys(collectionData || {}).join(', ')}</p>
      <button 
        onClick={handleTestMove}
        className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
      >
        Test Move First Bookmark
      </button>
    </div>
  );
};
