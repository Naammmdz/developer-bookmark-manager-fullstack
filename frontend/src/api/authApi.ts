import api from "./apiClient";
import { AuthCredentials, RegisterData, User, AuthResponse } from "../types";


export const login = async (creds: AuthCredentials) => {
  const { data } = await api.post<AuthResponse>('/api/auth/login', creds);
  return data;
};

export const register = async (info: RegisterData) => {
  const { data } = await api.post<AuthResponse>('/api/auth/register', info);
  return data;
};

export const fetchCurrentUser = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  // Token sẽ được thêm vào header tự động bởi interceptor
  const { data } = await api.get<AuthResponse>('/api/auth/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/api/auth/logout');
};