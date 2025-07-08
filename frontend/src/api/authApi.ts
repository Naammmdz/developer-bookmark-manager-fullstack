import api from "./apiClient";
import { AuthCredentials,  RegisterData, User} from "../types";


export const login = async (creds: AuthCredentials) => {
  const { data } = await api.post<{ token: string }>('/auth/login', creds);
  return data;
};

export const register = async (info: RegisterData) => {
  const { data } = await api.post<{ token: string; user: User }>('/auth/register', info);
  return data;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};