import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { X, CheckCircle, User, Mail, LogOut, Settings, Shield, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// These should ideally match the keys and provide human-readable names
// for the options defined in BackgroundAnimation.tsx
// Preview styles are simplified here; they could be more elaborate.
const backgroundDisplayOptions = [
  {
    key: 'defaultGradient',
    name: 'Default Dark',
    previewStyle: { background: '#000000' }
  },
  {
    key: 'oceanBlue',
    name: 'Ocean Blue',
    previewStyle: { background: 'linear-gradient(135deg, #1e3a8a, #1e40af, #0891b2)' }
  },
  {
    key: 'sunsetOrange',
    name: 'Sunset Orange',
    previewStyle: { background: 'linear-gradient(135deg, #9a3412, #dc2626, #eab308)' }
  },
  {
    key: 'devDark',
    name: 'Developer Dark',
    previewStyle: { background: '#111827' }
  },
  {
    key: 'cosmicPurple',
    name: 'Cosmic Purple',
    previewStyle: { background: 'linear-gradient(135deg, #581c87, #7c2d12, #be185d)'}
  },
  {
    key: 'forestGreen',
    name: 'Forest Green',
    previewStyle: { background: '#166534' }
  }
];


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { selectedBackground, setSelectedBackground } = useSettings();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Account');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderAccountTab = () => {
    if (!user) {
      return (
        <div className="text-center py-8">
          <p className="text-white/60">No user information available</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-4 mb-6">
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
          {user.fullName && (
            <div className="flex items-center gap-3">
              <User size={18} className="text-white/60" />
              <div>
                <p className="text-white/60 text-sm">Full Name</p>
                <p className="text-white font-medium">{user.fullName}</p>
              </div>
            </div>
          )}
          {user.role && (
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
          )}
        </div>
        <div className="flex justify-start gap-3 mt-auto">
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
    );
  };

  const renderDisplaySettingsTab = () => {
    return (
      <div>
        <h3 className="text-lg font-medium mb-1 text-white/90">Background Theme</h3>
        <p className="text-sm text-white/60 mb-5">Choose your preferred background style for the application.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {backgroundDisplayOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                console.log('SettingsModal - Clicking background option:', option.key);
                setSelectedBackground(option.key);
              }}
              className={`
                p-3.5 rounded-lg border text-left
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-darker
                ${selectedBackground === option.key
                  ? 'border-primary bg-primary/10 ring-2 ring-primary'
                  : 'border-white/20 bg-white/[.03] hover:border-white/30 hover:bg-white/[.06]'}
              `}
              aria-pressed={selectedBackground === option.key}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-white/95">{option.name}</span>
                {selectedBackground === option.key && <CheckCircle size={18} className="text-primary" />}
              </div>
              <div
                className="w-full h-7 mt-2 rounded border border-white/10"
                style={option.previewStyle}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPrivacySecurityTab = () => {
    return (
      <div>
        <h3 className="text-lg font-medium mb-1 text-white/90">Privacy & Security Settings</h3>
        <p className="text-sm text-white/60 mb-5">Manage your privacy and data settings below.</p>
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Data Retention</span>
            <button className="bg-primary hover:bg-primary/90 text-black px-3 py-2 rounded-md font-medium transition-colors">Configure</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Export Data</span>
            <button className="bg-primary hover:bg-primary/90 text-black px-3 py-2 rounded-md font-medium transition-colors">Export</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Clear Browsing Data</span>
            <button className="bg-primary hover:bg-primary/90 text-black px-3 py-2 rounded-md font-medium transition-colors">Clear</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Enable Two-Factor Authentication</span>
            <button className="bg-primary hover:bg-primary/90 text-black px-3 py-2 rounded-md font-medium transition-colors">Enable</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70">Session Timeout</span>
            <button className="bg-primary hover:bg-primary/90 text-black px-3 py-2 rounded-md font-medium transition-colors">Set</button>
          </div>
        </div>
      </div>
    );
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
      case 'Account':
        return renderAccountTab();
      case 'Display Settings':
        return renderDisplaySettingsTab();
      case 'Privacy & Security':
        return renderPrivacySecurityTab();
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
              onClick={() => setActiveTab('Account')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'Account' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <User size={16} />
              Account
            </button>
            <button
              onClick={() => setActiveTab('Display Settings')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'Display Settings' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <Settings size={16} />
              Display Settings
            </button>
            <button
              onClick={() => setActiveTab('Privacy & Security')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'Privacy & Security' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <Shield size={16} />
              Privacy & Security
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
