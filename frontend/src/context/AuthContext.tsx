import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/authApi';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  loginAsAdmin: () => void; // Temporary for testing
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra token khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isDemoAdmin = localStorage.getItem('demo-admin');
    
    if (isDemoAdmin) {
      // Load demo admin user
      const adminUser: User = {
        id: 1,
        name: 'Admin User',
        email: 'admin@demo.com',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
      };
      setUser(adminUser);
      setIsLoading(false);
    } else if (token) {
      authApi.fetchCurrentUser()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token } = await authApi.login({ email, password });
    localStorage.setItem('token', token);
    const userData = await authApi.fetchCurrentUser();
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token } = await authApi.register({ name, email, password });
    localStorage.setItem('token', token);
    const userData = await authApi.fetchCurrentUser();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    authApi.logout().catch(console.error);
  };

  // Temporary demo admin login for testing
  const loginAsAdmin = () => {
    const adminUser: User = {
      id: 1,
      name: 'Admin User',
      email: 'admin@demo.com',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString()
    };
    setUser(adminUser);
    localStorage.setItem('demo-admin', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, loginAsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};