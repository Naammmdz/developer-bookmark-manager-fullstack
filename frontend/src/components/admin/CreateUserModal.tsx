import React, { useState, FormEvent } from 'react';
import { createUser } from '../../api/adminApi';
import { User } from '../../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const newUser = await createUser({
        username,
        email,
        fullName,
        password
      });
      
      // Call the callback to update the user list
      onUserCreated(newUser);
      
      // Reset form and close modal
      setUsername('');
      setEmail('');
      setFullName('');
      setPassword('');
      onClose();
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to create user. Please try again.';
      setError(errorMessage);
      console.error('Create user error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
        className="bg-background-darker p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/10 transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New User</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <p className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md mb-4 border border-red-500/30">
              {error}
            </p>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="create-username">
              Username
            </label>
            <input
              type="text"
              id="create-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Choose a username"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="create-email">
              Email Address
            </label>
            <input
              type="email"
              id="create-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="user@example.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="create-fullName">
              Full Name
            </label>
            <input
              type="text"
              id="create-fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Enter user's full name"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="create-password">
              Password
            </label>
            <input
              type="password"
              id="create-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Set a password for the user"
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-black px-5 py-2 rounded-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-opacity flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
