import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, ListPlus, User, Search } from 'lucide-react'; // Added new icons
import { ShimmerButton } from '../ui/shimmer-button';
import UserProfilePopup from '../auth/UserProfilePopup';

interface HeaderProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openSettingsModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openLoginModal, openRegisterModal, openSettingsModal }) => {
  const { searchTerm, setSearchTerm, openModal } = useBookmarks();
  const { user: currentUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // setSearchTerm is from useBookmarks context
  };

  const handleProfileClick = () => {
    if (currentUser) {
      setIsProfileOpen(true);
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="flex items-center justify-between h-14 px-4"> {/* Root div as specified */}
      {/* Title */}
      <Link 
        to="/landing" 
        className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer"
        title="Go to Landing Page"
      >
        Dev Bookmarks
      </Link>

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
      
      {/* User Profile Popup */}
      {isProfileOpen && (
        <UserProfilePopup onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
};

export default Header;
