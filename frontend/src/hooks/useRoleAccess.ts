import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  isAdmin,
  isUser,
  hasRole,
  hasAnyRole,
  canAccessAdminPanel,
  canManageUsers,
  canDeleteAnyBookmark,
  canViewUserStats,
  canAccessUserDashboard,
  UserRole,
  hasJWTRole,
  hasAnyJWTRole,
  isAdminFromRoles,
  isUserFromRoles,
  canAccessAdminPanelWithRoles,
  canManageUsersWithRoles,
  canDeleteAnyBookmarkWithRoles,
  canViewUserStatsWithRoles,
  canAccessUserDashboardWithRoles
} from '../utils/roleUtils';

// Main hook for role-based access control
export const useRoleAccess = () => {
  const { user, userRoles } = useAuth();
  
  return useMemo(() => ({
    // User info
    user,
    userRoles,
    isAuthenticated: !!user,
    
    // JWT Role checks
    isAdmin: isAdminFromRoles(userRoles),
    isUser: isUserFromRoles(userRoles),
    hasJWTRole: (role: string) => hasJWTRole(userRoles, role),
    hasAnyJWTRole: (roles: string[]) => hasAnyJWTRole(userRoles, roles),
    
    // Legacy role checks (for backward compatibility)
    hasRole: (role: UserRole) => hasRole(user, role),
    hasAnyRole: (roles: UserRole[]) => hasAnyRole(user, roles),
    
    // JWT Permission checks
    canAccessAdminPanel: canAccessAdminPanelWithRoles(userRoles),
    canManageUsers: canManageUsersWithRoles(userRoles),
    canDeleteAnyBookmark: canDeleteAnyBookmarkWithRoles(userRoles),
    canViewUserStats: canViewUserStatsWithRoles(userRoles),
    canAccessUserDashboard: canAccessUserDashboardWithRoles(userRoles),
    
    // Current user role
    currentRole: user?.role || null,
  }), [user, userRoles]);
};

// Hook specifically for admin-only functionality
export const useAdminAccess = () => {
  const { userRoles } = useAuth();
  
  return useMemo(() => ({
    isAdmin: isAdminFromRoles(userRoles),
    canAccessAdminPanel: canAccessAdminPanelWithRoles(userRoles),
    canManageUsers: canManageUsersWithRoles(userRoles),
    canViewUserStats: canViewUserStatsWithRoles(userRoles),
    canDeleteAnyBookmark: canDeleteAnyBookmarkWithRoles(userRoles),
  }), [userRoles]);
};

// Hook for checking if user has specific permissions
export const usePermissions = () => {
  const { user } = useAuth();
  
  return useMemo(() => ({
    check: (permission: string) => {
      if (!user) return false;
      
      switch (permission) {
        case 'admin.access':
          return canAccessAdminPanel(user);
        case 'admin.manage_users':
          return canManageUsers(user);
        case 'admin.view_stats':
          return canViewUserStats(user);
        case 'admin.delete_any_bookmark':
          return canDeleteAnyBookmark(user);
        case 'user.access_dashboard':
          return canAccessUserDashboard(user);
        default:
          return false;
      }
    },
    
    checkMultiple: (permissions: string[]) => {
      return permissions.every(permission => {
        if (!user) return false;
        
        switch (permission) {
          case 'admin.access':
            return canAccessAdminPanel(user);
          case 'admin.manage_users':
            return canManageUsers(user);
          case 'admin.view_stats':
            return canViewUserStats(user);
          case 'admin.delete_any_bookmark':
            return canDeleteAnyBookmark(user);
          case 'user.access_dashboard':
            return canAccessUserDashboard(user);
          default:
            return false;
        }
      });
    }
  }), [user]);
};
