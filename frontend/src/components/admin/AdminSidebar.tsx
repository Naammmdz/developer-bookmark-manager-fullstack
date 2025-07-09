import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  Database,
  FileText,
  Activity,
  Home
} from 'lucide-react';

interface AdminSidebarItemProps {
  id: string;
  icon: React.ReactNode;
  name: string;
  path: string;
  isActive: boolean;
  itemIndex?: number;
}

const AdminSidebarItem: React.FC<AdminSidebarItemProps> = ({ 
  id, 
  icon, 
  name, 
  path, 
  isActive, 
  itemIndex = 0 
}) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: 0.1 + (itemIndex * 0.05) }}
      className="relative group"
    >
      <Link
        to={path}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ease-in-out
                    ${isActive
                      ? 'bg-primary/20 text-primary font-medium border border-primary/30'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
        <span className="flex-1 truncate text-sm font-medium">{name}</span>
      </Link>
    </motion.div>
  );
};

const AdminSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminMenuItems = [
    {
      id: 'dashboard',
      icon: <BarChart3 size={20} />,
      name: 'Dashboard',
      path: '/app/admin'
    },
    {
      id: 'users',
      icon: <Users size={20} />,
      name: 'User Management',
      path: '/app/admin/users'
    },
    {
      id: 'roles',
      icon: <Shield size={20} />,
      name: 'Roles & Permissions',
      path: '/app/admin/roles'
    },
    {
      id: 'analytics',
      icon: <Activity size={20} />,
      name: 'Analytics',
      path: '/app/admin/analytics'
    },
    {
      id: 'system',
      icon: <Database size={20} />,
      name: 'System Status',
      path: '/app/admin/system'
    },
    {
      id: 'logs',
      icon: <FileText size={20} />,
      name: 'System Logs',
      path: '/app/admin/logs'
    },
    {
      id: 'settings',
      icon: <Settings size={20} />,
      name: 'Admin Settings',
      path: '/app/admin/settings'
    }
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="hidden md:block"
    >
      <div className="h-full flex flex-col">
        {/* Admin Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Admin Panel</h2>
              <p className="text-xs text-white/60">System Management</p>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminMenuItems.map((item, index) => (
            <AdminSidebarItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              name={item.name}
              path={item.path}
              isActive={location.pathname === item.path}
              itemIndex={index}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <div className="pt-1 pb-1">
            <h2 className="text-xs text-white/40 font-semibold uppercase px-3 mb-1">Quick Actions</h2>
          </div>
          
          <AdminSidebarItem
            id="back-to-app"
            icon={<Home size={20} />}
            name="Back to App"
            path="/app"
            isActive={false}
          />
        </div>

        {/* Admin User Info */}
        {user && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {user.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-white/60 truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
