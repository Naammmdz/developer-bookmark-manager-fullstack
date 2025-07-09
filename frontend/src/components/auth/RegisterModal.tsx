import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  openLoginModal?: () => void;
  onRegisterSuccess?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, openLoginModal, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuth();
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(username, email, password, fullName);
      onClose(); // Close modal on successful registration
      if (onRegisterSuccess) {
        onRegisterSuccess(); // Call the redirect function
      }
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to register. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', err);
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
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
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
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="reg-username">
              Username
            </label>
            <input
              type="text"
              id="reg-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Choose a username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="reg-email">
              Email Address
            </label>
            <input
              type="email"
              id="reg-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="reg-fullName">
              Full Name
            </label>
            <input
              type="text"
              id="reg-fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="reg-password">
              Password
            </label>
            <input
              type="password"
              id="reg-password" // Changed id
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Choose a strong password"
            />
          </div>
          <div className="flex items-center justify-between gap-3 pt-2">
            {/* {openLoginModal && (
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">or</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openLoginModal();
                  }}
                  className="text-primary hover:underline text-sm"
                >
                  Login
                </button>
              </div>
            )} */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-black px-5 py-2 rounded-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-opacity flex items-center justify-center min-w-[120px]" // Adjusted min-width for "Registering..."
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Register'
              )}
            </button>
            {openLoginModal && (
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">or</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openLoginModal();
                  }}
                  className="text-primary hover:underline text-sm"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
