import React, { ReactNode } from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { UserRole } from '../../utils/roleUtils';

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, user needs ANY permission
  fallback?: ReactNode;
}

// Component to conditionally render content based on user role
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback = null
}) => {
  const { hasAnyRole } = useRoleAccess();
  
  // Check role-based access
  const hasRoleAccess = allowedRoles.length === 0 || hasAnyRole(allowedRoles);
  
  // Check permission-based access
  const hasPermissionAccess = requiredPermissions.length === 0 || 
    (requireAll 
      ? requiredPermissions.every(permission => checkPermission(permission))
      : requiredPermissions.some(permission => checkPermission(permission))
    );
  
  const hasAccess = hasRoleAccess && hasPermissionAccess;
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Helper function to check individual permissions
const checkPermission = (permission: string): boolean => {
  // This would be implemented based on your permission system
  // For now, we'll use a simple mapping
  return false; // Placeholder
};

// Component specifically for admin-only content
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = null
}) => {
  const { isAdmin } = useRoleAccess();
  
  return isAdmin ? <>{children}</> : <>{fallback}</>;
};

// Component for authenticated users only
export const AuthenticatedOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = null
}) => {
  const { isAuthenticated } = useRoleAccess();
  
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

// Component for user role only (non-admin)
export const UserOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = null
}) => {
  const { isUser } = useRoleAccess();
  
  return isUser ? <>{children}</> : <>{fallback}</>;
};

// Component to show different content based on role
interface RoleBasedContentProps {
  adminContent?: ReactNode;
  userContent?: ReactNode;
  guestContent?: ReactNode;
  fallback?: ReactNode;
}

export const RoleBasedContent: React.FC<RoleBasedContentProps> = ({
  adminContent,
  userContent,
  guestContent,
  fallback = null
}) => {
  const { isAdmin, isUser, isAuthenticated } = useRoleAccess();
  
  if (isAdmin && adminContent) {
    return <>{adminContent}</>;
  }
  
  if (isUser && userContent) {
    return <>{userContent}</>;
  }
  
  if (!isAuthenticated && guestContent) {
    return <>{guestContent}</>;
  }
  
  return <>{fallback}</>;
};

// Higher-order component for role-based access
export const withRoleAccess = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
  fallback?: ReactNode
) => {
  return (props: P) => {
    const { hasAnyRole } = useRoleAccess();
    
    if (!hasAnyRole(allowedRoles)) {
      return <>{fallback}</>;
    }
    
    return <Component {...props} />;
  };
};

// Higher-order component for admin-only access
export const withAdminAccess = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => {
    const { isAdmin } = useRoleAccess();
    
    if (!isAdmin) {
      return <>{fallback}</>;
    }
    
    return <Component {...props} />;
  };
};
