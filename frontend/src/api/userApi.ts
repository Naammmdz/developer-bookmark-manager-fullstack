import apiClient from "./apiClient";
import { AuthResponse } from "../types";

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get current user profile
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get("/api/auth/me");
  return response.data;
};

// Update user profile
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<AuthResponse> => {
  const response = await apiClient.put("/api/auth/profile", data);
  return response.data;
};

// Change password
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<void> => {
  await apiClient.put("/api/auth/password", data);
};
