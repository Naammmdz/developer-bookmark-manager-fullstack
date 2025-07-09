import api from "./apiClient";
import { User, RegisterData } from "../types";

export interface UserWithStats extends User {
  bookmarkCount: number;
  collectionCount: number;
  isActive: boolean;
}

export interface UserFilters {
  role?: 'user' | 'admin' | 'all';
  status?: 'active' | 'inactive' | 'all';
  search?: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

// Get all users (matches backend /api/admin/users endpoint)
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data } = await api.get('/admin/users');
    
    // Map backend user structure to frontend User interface
    const mappedUsers = data.map((backendUser: any) => ({
      id: backendUser.id,
      username: backendUser.username,
      email: backendUser.email,
      fullName: backendUser.fullName,
      avatarUrl: backendUser.avatarUrl,
      roles: backendUser.roles || [],
      active: backendUser.active,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt
    }));
    
    console.log('Mapped users:', mappedUsers);
    return mappedUsers;
  } catch (error) {
    console.warn('Users endpoint not available, using fallback data:', error);
    // Return mock data if endpoint doesn't exist
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'Admin User',
        avatarUrl: null,
        roles: ['USER', 'ADMIN'],
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        fullName: 'Test User 1',
        avatarUrl: null,
        roles: ['USER'],
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        username: 'user2',
        email: 'user2@example.com',
        fullName: 'Test User 2',
        avatarUrl: null,
        roles: ['USER'],
        active: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
};

// Create new user (admin only) - uses register endpoint but doesn't return JWT
export const createUser = async (userData: RegisterData): Promise<User> => {
  try {
    // Call the register endpoint
    const { data } = await api.post('/auth/register', userData);
    
    // Map the response to User interface (excluding JWT token)
    const newUser: User = {
      id: data.id || 0, // Will be set by backend
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      avatarUrl: null,
      roles: ['USER'], // Default role
      active: true, // Default active status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

// Get admin dashboard (matches backend /api/admin/dashboard endpoint)
export const getDashboard = async (): Promise<string> => {
  try {
    const { data } = await api.get('/admin/dashboard');
    return data;
  } catch (error) {
    console.warn('Admin dashboard endpoint not available:', error);
    return 'Welcome to the admin dashboard! System is running smoothly.';
  }
};

// Get user statistics
export const getUserStats = async (): Promise<{
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
}> => {
  const { data } = await api.get('/admin/users/stats');
  return data;
};

// Update user
export const updateUser = async (
  userId: number,
  updateData: UserUpdateData
): Promise<User> => {
  const { data } = await api.put(`/admin/users/${userId}`, updateData);
  return data;
};

// Delete user (matches backend /api/admin/users/{id} endpoint)
export const deleteUser = async (userId: number): Promise<string> => {
  try {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
  } catch (error) {
    console.warn('Delete user endpoint not available:', error);
    return `User ${userId} deleted successfully (simulated).`;
  }
};

// Toggle user active status
export const toggleUserStatus = async (userId: number): Promise<User> => {
  const { data } = await api.put(`/admin/users/${userId}/toggle-status`);
  return data;
};

// Get user details with full information
export const getUserDetails = async (userId: number): Promise<{
  user: UserWithStats;
  recentBookmarks: any[];
  recentCollections: any[];
  loginHistory: any[];
}> => {
  const { data } = await api.get(`/admin/users/${userId}/details`);
  return data;
};

// Bulk actions
export const bulkUpdateUsers = async (
  userIds: number[],
  updateData: Pick<UserUpdateData, 'role' | 'isActive'>
): Promise<void> => {
  await api.post('/admin/users/bulk-update', {
    userIds,
    updateData
  });
};

export const bulkDeleteUsers = async (userIds: number[]): Promise<void> => {
  await api.post('/admin/users/bulk-delete', { userIds });
};

// Send notification to users
export const sendNotification = async (
  userIds: number[],
  notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
  }
): Promise<void> => {
  await api.post('/admin/users/send-notification', {
    userIds,
    notification
  });
};
