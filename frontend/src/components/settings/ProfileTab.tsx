import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Edit2, Save, X, LogOut } from 'lucide-react';

interface ProfileTabProps {
  onClose?: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.fullName || ''
  });

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No user information available</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    // Sync form data with current user data when entering edit mode
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      fullName: user?.fullName || ''
    });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      fullName: user?.fullName || ''
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Client-side validation
      if (!formData.username.trim()) {
        setError('Username is required');
        setIsLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setError('Email is required');
        setIsLoading(false);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      if (!formData.fullName.trim()) {
        setError('Full name is required');
        setIsLoading(false);
        return;
      }

      // Check if anything has changed
      const hasChanges = 
        formData.username !== user.username ||
        formData.email !== user.email ||
        formData.fullName !== user.fullName;

      if (!hasChanges) {
        setIsEditing(false);
        setIsLoading(false);
        return;
      }

      // Send all fields (not just changed ones) to avoid backend validation issues
      const updateData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        fullName: formData.fullName.trim()
      };

      await updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (
    label: string,
    name: keyof typeof formData,
    value: string,
    icon: React.ReactNode
  ) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-white/60 text-sm mb-1">{label}</p>
        {isEditing ? (
          <input
            type={name === 'email' ? 'email' : 'text'}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className="w-full bg-transparent text-white font-medium border-none outline-none placeholder-white/40"
            placeholder={label}
          />
        ) : (
          <p className="text-white font-medium">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Success/Error Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <p className="text-green-300 text-sm">{success}</p>
        </div>
      )}

      {/* Profile Fields */}
      <div className="flex-1 space-y-4 mb-6">
        {renderField('Username', 'username', user.username, <User size={18} className="text-white/60" />)}
        {renderField('Email', 'email', user.email, <Mail size={18} className="text-white/60" />)}
        {renderField('Full Name', 'fullName', user.fullName, <User size={18} className="text-white/60" />)}
        
        {/* Role field (read-only) */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
            <div className={`w-3 h-3 rounded-full ${
              user.role === 'admin' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
          </div>
          <div className="flex-1">
            <p className="text-white/60 text-sm mb-1">Role</p>
            <p className="text-white font-medium capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          disabled={isEditing}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>

        {/* Edit/Save Buttons */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-md transition-colors disabled:opacity-50"
              >
                <X size={16} className="inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors flex items-center gap-2"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
