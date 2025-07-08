import React from 'react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, ListPlus, User, Search } from 'lucide-react'; // Added new icons
import { ShimmerButton } from '../ui/shimmer-button';

interface HeaderProps {
  openLoginModal: () => void;
  openSettingsModal: () => void;
  // openRegisterModal is removed as it's not used in the new design
}

const Header: React.FC<HeaderProps> = ({ openLoginModal, openSettingsModal }) => {
  const { searchTerm, setSearchTerm, openModal } = useBookmarks();
  const { user: currentUser, loginAsAdmin } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // setSearchTerm is from useBookmarks context
  };

  const handleProfileClick = () => {
    if (currentUser) {
      openSettingsModal();
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="flex items-center justify-between h-14 px-4"> {/* Root div as specified */}
      {/* Title */}
      <h1 className="text-lg font-semibold">Dev Bookmarks</h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-6 relative"> {/* Adjusted for better spacing and icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-white/40" />
        </div>
        <input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-1.5 rounded bg-secondary border border-transparent focus:border-border outline-none placeholder-muted-foreground text-sm transition-colors duration-150"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Temporary Admin Login Button */}
        {!currentUser && (
          <button
            onClick={loginAsAdmin}
            className="px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors font-medium"
            title="Login as Demo Admin"
          >
            Demo Admin
          </button>
        )}
        
        <button
          onClick={() => openModal()}
          className="p-2 text-muted-foreground hover:text-foreground rounded transition-colors"
          title="Add Bookmark"
        >
          <ListPlus size={20} />
        </button>

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