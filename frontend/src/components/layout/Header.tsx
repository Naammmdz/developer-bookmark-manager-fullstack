import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../../context/BookmarkContext';
import { useCodeBlocks } from '../../context/CodeBlockContext';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, ListPlus, User, Search, Code, ChevronDown } from 'lucide-react';
import { ShimmerButton } from '../ui/shimmer-button';

interface HeaderProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openSettingsModal: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

const Header: React.FC<HeaderProps> = ({ openLoginModal, openRegisterModal, openSettingsModal, searchInputRef }) => {
  const { searchTerm, setSearchTerm, openModal } = useBookmarks();
  const { openModal: openCodeBlockModal } = useCodeBlocks();
  const { user: currentUser } = useAuth();
  
  // Add dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // setSearchTerm is from useBookmarks context
  };

  const handleProfileClick = () => {
    if (currentUser) {
      openSettingsModal(); // Open the settings modal instead of profile popup
    } else {
      openLoginModal();
    }
  };
  
  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle dropdown option clicks
  const handleAddBookmark = () => {
    openModal();
    setIsDropdownOpen(false);
  };
  
  const handleAddCodeBlock = () => {
    openCodeBlockModal();
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between h-14 px-4"> {/* Root div as specified */}
      {/* Logo */}
      <Link 
        to="/landing" 
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        title="Go to Landing Page"
      >
        <span className="text-lg font-semibold text-white">DevPin</span>
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-6 relative"> {/* Adjusted for better spacing and icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-white/40" />
        </div>
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-1.5 rounded bg-secondary border border-transparent focus:border-border outline-none placeholder-muted-foreground text-sm transition-colors duration-150"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Add Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 p-2 text-muted-foreground hover:text-foreground rounded transition-colors"
            title="Add Content"
          >
            <ListPlus size={20} />
            <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl z-50">
              <div className="py-1">
                <button
                  onClick={handleAddBookmark}
                  className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <Bookmark size={16} className="text-primary" />
                  <span>Add Bookmark</span>
                </button>
                <button
                  onClick={handleAddCodeBlock}
                  className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <Code size={16} className="text-green-400" />
                  <span>Add Code Block</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Icon Button */}
        <button
          onClick={handleProfileClick}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          title={currentUser ? "Profile Settings" : "Login"}
        >
          {currentUser && currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <User size={22} className="text-white/70 hover:text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
