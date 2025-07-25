import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Mail } from 'lucide-react';

interface UserProfilePopupProps {
  onClose: () => void;
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ onClose }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Handle closing modal if clicking on the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-background-darker p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm border border-white/10 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <User size={18} className="text-white/60" />
            <div>
              <p className="text-white/60 text-sm">Username</p>
              <p className="text-white font-medium">{user.username}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-white/60" />
            <div>
              <p className="text-white/60 text-sm">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <User size={18} className="text-white/60" />
            <div>
              <p className="text-white/60 text-sm">Full Name</p>
              <p className="text-white font-medium">{user.fullName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-[18px] h-[18px] flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${
                user.role === 'admin' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
            </div>
            <div>
              <p className="text-white/60 text-sm">Role</p>
              <p className="text-white font-medium capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePopup;

