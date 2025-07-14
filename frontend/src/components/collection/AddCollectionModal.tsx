import React, { useState, useEffect } from 'react';
import { CustomIcon } from '../../utils/iconMapping';

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCollection: (name: string, icon: string) => void;
}

const AddCollectionModal: React.FC<AddCollectionModalProps> = ({
  isOpen,
  onClose,
  onAddCollection,
}) => {
  const [collectionName, setCollectionName] = useState('');
  const [collectionIcon, setCollectionIcon] = useState('Folder');
  
  // Available icons for collections (organized by category)
  const availableIcons = [
    // General
    { value: 'Folder', label: 'Folder' },
    { value: 'Bookmark', label: 'Bookmark' },
    { value: 'Star', label: 'Star' },
    { value: 'Heart', label: 'Heart' },
    { value: 'Archive', label: 'Archive' },
    { value: 'Clock', label: 'Clock' },
    
    // Development & Code
    { value: 'Code', label: 'Code' },
    { value: 'Code2', label: 'Code2' },
    { value: 'Terminal', label: 'Terminal' },
    { value: 'Bug', label: 'Bug' },
    { value: 'Wrench', label: 'Wrench' },
    { value: 'Settings', label: 'Settings' },
    { value: 'Cog', label: 'Cog' },
    { value: 'Hammer', label: 'Hammer' },
    { value: 'Hash', label: 'Hash' },
    { value: 'Braces', label: 'Braces' },
    
    // Git & Version Control
    { value: 'GitBranch', label: 'Git Branch' },
    { value: 'GitCommit', label: 'Git Commit' },
    { value: 'GitMerge', label: 'Git Merge' },
    { value: 'GitPullRequest', label: 'Pull Request' },
    
    // Infrastructure & Tech
    { value: 'Server', label: 'Server' },
    { value: 'Database', label: 'Database' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'Download', label: 'Download' },
    { value: 'Upload', label: 'Upload' },
    { value: 'Package', label: 'Package' },
    { value: 'Cpu', label: 'CPU' },
    { value: 'HardDrive', label: 'Hard Drive' },
    { value: 'Wifi', label: 'WiFi' },
    
    // Devices & Platforms
    { value: 'Monitor', label: 'Monitor' },
    { value: 'Laptop', label: 'Laptop' },
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'Tablet', label: 'Tablet' },
    
    // UI & Design
    { value: 'Layout', label: 'Layout' },
    { value: 'LayoutGrid', label: 'Grid Layout' },
    { value: 'LayoutList', label: 'List Layout' },
    { value: 'Component', label: 'Component' },
    { value: 'Layers', label: 'Layers' },
    { value: 'Palette', label: 'Palette' },
    { value: 'Box', label: 'Box' },
    { value: 'Boxes', label: 'Boxes' },
    
    // Web & Network
    { value: 'Globe', label: 'Globe' },
    { value: 'FileText', label: 'Documentation' },
    { value: 'Zap', label: 'Performance' },
    
    // Other
    { value: 'Coffee', label: 'Coffee' },
    { value: 'Music', label: 'Music' },
    { value: 'Camera', label: 'Camera' },
  ];

  // Reset state when modal opens/closes or is about to open
  useEffect(() => {
    if (isOpen) {
      setCollectionName('');
      setCollectionIcon('Folder');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmedName = collectionName.trim();
    const trimmedIcon = collectionIcon.trim();

    if (!trimmedName) {
      alert('Collection name cannot be empty.');
      return;
    }
    if (!trimmedIcon) {
      alert('Collection icon cannot be empty. Please provide an emoji or a short character.');
      return;
    }

    onAddCollection(trimmedName, trimmedIcon);
    onClose(); // Close modal after adding
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in-fast"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl w-full max-w-md" // Removed animation classes
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Collection</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="collectionName" className="block text-sm font-medium text-white/80 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                id="collectionName"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="e.g., 'React Projects' or 'Design Inspiration'"
                className="w-full p-2.5 rounded-lg bg-white/5 border border-white/20 placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-white transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="collectionIcon" className="block text-sm font-medium text-white/80 mb-1">
                Icon
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/20">
                  <CustomIcon icon={collectionIcon} size={20} className="text-white/90" />
                </div>
                <select
                  id="collectionIcon"
                  value={collectionIcon}
                  onChange={(e) => setCollectionIcon(e.target.value)}
                  className="flex-1 p-2.5 rounded-lg bg-white/5 border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-white transition-colors"
                  style={{ colorScheme: 'dark' }}
                  required
                >
                  {availableIcons.map((icon) => (
                    <option 
                      key={icon.value} 
                      value={icon.value}
                      style={{
                        backgroundColor: '#1f1f1f',
                        color: '#ffffff'
                      }}
                    >
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollectionModal;
