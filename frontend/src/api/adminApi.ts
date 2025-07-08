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

// Get all users with pagination and filtering
export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  filters: UserFilters = {}
): Promise<{
  users: UserWithStats[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value !== 'all') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>)
  });

  const { data } = await api.get(`/admin/users?${params}`);
  return data;
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

// Delete user
export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/admin/users/${userId}`);
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
