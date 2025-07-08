import { User } from '../types';

// Role types
export type UserRole = 'user' | 'admin';

// JWT Role checking functions
export const hasJWTRole = (roles: string[], roleToCheck: string): boolean => {
  return roles.includes(roleToCheck);
};

export const hasAnyJWTRole = (roles: string[], rolesToCheck: string[]): boolean => {
  return rolesToCheck.some(role => roles.includes(role));
};

export const isAdminFromRoles = (roles: string[]): boolean => {
  return hasJWTRole(roles, 'ROLE_ADMIN');
};

export const isUserFromRoles = (roles: string[]): boolean => {
  return hasJWTRole(roles, 'ROLE_USER');
};

// Legacy role checking functions (for backward compatibility)
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isUser = (user: User | null): boolean => {
  return user?.role === 'user';
};

export const hasRole = (user: User | null, role: UserRole): boolean => {
  return user?.role === role;
};

export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  return user ? roles.includes(user.role) : false;
};

// JWT-based permission checking functions
export const canAccessAdminPanelWithRoles = (roles: string[]): boolean => {
  return isAdminFromRoles(roles);
};

export const canManageUsersWithRoles = (roles: string[]): boolean => {
  return isAdminFromRoles(roles);
};

export const canDeleteAnyBookmarkWithRoles = (roles: string[]): boolean => {
  return isAdminFromRoles(roles);
};

export const canViewUserStatsWithRoles = (roles: string[]): boolean => {
  return isAdminFromRoles(roles);
};

export const canAccessUserDashboardWithRoles = (roles: string[]): boolean => {
  return roles.length > 0; // Any authenticated user with roles
};

// Legacy permission checking functions (for backward compatibility)
export const canAccessAdminPanel = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canManageUsers = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canDeleteAnyBookmark = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canViewUserStats = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canAccessUserDashboard = (user: User | null): boolean => {
  return user !== null; // Any authenticated user
};

// Role display functions
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'user':
      return 'User';
    default:
      return 'Unknown';
  }
};

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'user':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

// Role validation
export const isValidRole = (role: string): role is UserRole => {
  return ['user', 'admin'].includes(role);
};
