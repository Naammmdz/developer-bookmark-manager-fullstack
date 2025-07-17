import React, { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/userApi";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setFullName(user.fullName || "");
      setAvatarUrl(user.avatarUrl || "");
      setError("");
      setSuccess("");
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const authResponse = await updateProfile({
        username,
        email,
        fullName,
        avatarUrl: avatarUrl || undefined,
      });

      // Update token in localStorage
      localStorage.setItem("token", authResponse.token);

      // Update user context with new data
      if (setUser) {
        const updatedUser = {
          ...user!,
          username: authResponse.username,
          email: authResponse.email,
          fullName: authResponse.fullName,
          avatarUrl: avatarUrl || null,
        };
        setUser(updatedUser);
        // Also update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again.";
      setError(errorMessage);
      console.error("Profile update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-background-darker p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/10 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Update Profile</h2>
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

          {success && (
            <p className="bg-green-500/10 text-green-400 text-sm p-3 rounded-md mb-4 border border-green-500/30">
              {success}
            </p>
          )}

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-white/70 mb-1.5"
              htmlFor="profile-username"
            >
              Username
            </label>
            <input
              type="text"
              id="profile-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Enter username"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-white/70 mb-1.5"
              htmlFor="profile-email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="profile-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-white/70 mb-1.5"
              htmlFor="profile-fullName"
            >
              Full Name
            </label>
            <input
              type="text"
              id="profile-fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium text-white/70 mb-1.5"
              htmlFor="profile-avatarUrl"
            >
              Avatar URL (Optional)
            </label>
            <input
              type="url"
              id="profile-avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white/90 placeholder-white/50 outline-none transition-all"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md font-semibold text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-black px-5 py-2 rounded-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-opacity flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
