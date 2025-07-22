import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, User, Mail, LogOut, Info, Lock } from 'lucide-react';
import ProfileTab from './ProfileTab';
import PasswordTab from './PasswordTab';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}



const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  const renderAboutTab = () => {
    return (
      <div>
        <h3 className="text-lg font-medium mb-1 text-white/90">About This Application</h3>
        <p className="text-sm text-white/60 mb-4">Version 1.0.0</p>
        <div className="space-y-2">
          <div>
            <span className="text-white/70">Developed by FullstackAI Team</span>
          </div>
          <div>
            <span className="text-white/70">For more information, visit our <a className="text-primary" href="#">website</a>.</span>
          </div>
          <div>
            <span className="text-white/70">Contact support: <a className="text-primary" href="mailto:support@example.com">support@example.com</a></span>
          </div>
          <div>
            <span className="text-white/70">Privacy Policy</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileTab onClose={onClose} />;
      case 'Password':
        return <PasswordTab />;
      case 'About':
        return renderAboutTab();
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-background-darker/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 text-white transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('Profile')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'Profile' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <User size={16} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('Password')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'Password' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <Lock size={16} />
              Password
            </button>
            <button
              onClick={() => setActiveTab('About')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'About' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <Info size={16} />
              About
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
            aria-label="Close settings"
          >
            <X size={22} />
          </button>
        </div>

        <div className="min-h-[400px] flex flex-col">
          {renderTabContent()}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-black font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-darker"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};


export default SettingsModal;
