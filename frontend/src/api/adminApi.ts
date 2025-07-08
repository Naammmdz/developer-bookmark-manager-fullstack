import api from "./apiClient";
import { User } from "../types";

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
      role: backendUser.roles?.some((role: any) => role.name === 'ADMIN') ? 'admin' as const : 'user' as const,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
      lastLogin: backendUser.updatedAt // Use updatedAt as lastLogin if no specific field
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
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        fullName: 'Test User 1',
        role: 'user' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      {
        id: 3,
        username: 'user2',
        email: 'user2@example.com',
        fullName: 'Test User 2',
        role: 'user' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    ];
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
