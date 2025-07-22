import api from "./apiClient";
import { AuthCredentials, RegisterData, User, AuthResponse } from "../types";


export const login = async (creds: AuthCredentials) => {
  const { data } = await api.post<AuthResponse>('/auth/login', creds);
  return data;
};

export const register = async (info: RegisterData) => {
  const { data } = await api.post<AuthResponse>('/auth/register', info);
  return data;
};

export const fetchCurrentUser = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  // Encode the token to handle special characters in URL
  const encodedToken = encodeURIComponent(token);
  const { data } = await api.post<AuthResponse>(`/auth/me/${encodedToken}`);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const updateProfile = async (request: UpdateUserRequest): Promise<AuthResponse> => {
  const { data } = await api.put<AuthResponse>('/auth/profile', request);
  return data;
};

export const changePassword = async (request: ChangePasswordRequest): Promise<string> => {
  const { data } = await api.put<string>('/auth/change-password', request);
  return data;
};
