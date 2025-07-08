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