import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, fetchCurrentUser, updateProfile as apiUpdateProfile, changePassword as apiChangePassword, UpdateUserRequest, ChangePasswordRequest } from '../api/authApi';
import { User } from '../types';
import { handleAuthError } from '../utils/errorHandler';
import { getUserRolesFromToken, isTokenExpired } from '../utils/jwtUtils';

interface AuthContextType {
  user: User | null;
  userRoles: string[];
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (request: UpdateUserRequest) => Promise<void>;
  changePassword: (request: ChangePasswordRequest) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra token khi app khởi động
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoading(false);
          return;
        }

        // Extract roles from JWT
        const roles = getUserRolesFromToken(token);
        setUserRoles(roles);

        // Restore user data from localStorage
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        
        // Fetch fresh user data from /me endpoint (optional)
        try {
          const freshUserData = await fetchCurrentUser();
          const userData: User = {
            id: 0,
            username: freshUserData.username,
            email: freshUserData.email,
            fullName: freshUserData.fullName,
            avatarUrl: null,
            role: roles.includes('ROLE_ADMIN') ? 'admin' : 'user',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } catch (error) {
          console.warn('Failed to fetch fresh user data from /me endpoint:', error);
          // Continue with stored user data if /me endpoint fails
        }

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiLogin({ username, password });
      localStorage.setItem('token', response.token);
      
      // Extract roles from JWT
      const roles = getUserRolesFromToken(response.token);
      setUserRoles(roles);
      
      // Create user object from AuthResponse
      const userData: User = {
        id: 0, // Will be set by backend when fetching full user data
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        avatarUrl: null,
        role: roles.includes('ROLE_ADMIN') ? 'admin' : 'user',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      console.error('Login failed:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (username: string, email: string, password: string, fullName: string) => {
    try {
      const response = await apiRegister({ username, email, password, fullName });
      localStorage.setItem('token', response.token);
      
      // Extract roles from JWT
      const roles = getUserRolesFromToken(response.token);
      setUserRoles(roles);
      
      // Create user object from AuthResponse
      const userData: User = {
        id: 0, // Will be set by backend when fetching full user data
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        avatarUrl: null,
        role: roles.includes('ROLE_ADMIN') ? 'admin' : 'user',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      console.error('Registration failed:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('demo-admin');
    setUser(null);
    setUserRoles([]);
    apiLogout().catch(console.error);
  };

  const updateProfile = async (request: UpdateUserRequest) => {
    try {
      const response = await apiUpdateProfile(request);
      
      // Update token with new information
      localStorage.setItem('token', response.token);
      
      // Extract roles from JWT
      const roles = getUserRolesFromToken(response.token);
      setUserRoles(roles);
      
      // Update user data
      const userData: User = {
        id: user?.id || 0,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        avatarUrl: user?.avatarUrl || null,
        role: roles.includes('ROLE_ADMIN') ? 'admin' : 'user',
        active: true,
        createdAt: user?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store updated user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      console.error('Profile update failed:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (request: ChangePasswordRequest) => {
    try {
      await apiChangePassword(request);
      // Password change successful - no need to update user data
    } catch (err) {
      const errorMessage = handleAuthError(err);
      console.error('Password change failed:', errorMessage);
      throw new Error(errorMessage);
    }
  };

return (
  <AuthContext.Provider value={{ user, userRoles, login, register, logout, updateProfile, changePassword, isLoading }}>
    {children}
  </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};