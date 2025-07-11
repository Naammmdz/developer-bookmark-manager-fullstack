import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "../components/profile/ProfileModal";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

          <div className="bg-background-darker rounded-xl p-6 border border-white/10">
            {/* Avatar Section */}
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {user.fullName}
                </h2>
                <p className="text-white/70">@{user.username}</p>
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Username:</span>
                <span className="text-white font-medium">{user.username}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Email:</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Full Name:</span>
                <span className="text-white font-medium">{user.fullName}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {user.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Roles:</span>
                <div className="flex gap-2">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary"
                    >
                      {role.replace("ROLE_", "")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Member Since:</span>
                <span className="text-white font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-white/70">Last Updated:</span>
                <span className="text-white font-medium">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>

              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
