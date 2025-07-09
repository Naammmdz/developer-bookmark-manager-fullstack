import React, { useEffect, useState, useMemo } from 'react';
import {
  getUsers,
  getDashboard,
  deleteUser
} from '../api/adminApi';
import { useAuth } from '../context/AuthContext';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { Users, Shield, Activity, UserPlus, MoreHorizontal } from 'lucide-react';
import { User } from '../types';
import CreateUserModal from '../components/admin/CreateUserModal';

const AdminPage = () => {
  const { user } = useAuth();
  const { isAdmin } = useRoleAccess();
  const [users, setUsers] = useState<User[]>([]);
  const [dashboardMessage, setDashboardMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  // Check if user is admin using JWT roles
  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/70">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First call dashboard endpoint
        console.log('Calling dashboard endpoint...');
        const dashboardMessage = await getDashboard();
        setDashboardMessage(dashboardMessage);
        console.log('Dashboard response:', dashboardMessage);

        // Then call users endpoint
        console.log('Calling users endpoint...');
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        console.log('Users response:', fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const result = await deleteUser(userId);
      console.log(result); // Log the success message
      
      // Toggle active status locally based on current status
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, active: !user.active } : user
      ));
    } catch (error) {
      console.error('Failed to toggle user status', error);
      setError('Failed to toggle user status.');
    }
  };

  const handleUserCreated = (newUser: User) => {
    // Add new user to local state
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  // Calculate stats from users data using useMemo
  const stats = useMemo(() => {
    // Check if users is an array before filtering
    if (!Array.isArray(users)) {
      return {
        totalUsers: 0,
        adminUsers: 0,
        userRoleCount: 0,
        activeUsers: 0,
        newUsersThisMonth: 0
      };
    }

    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.roles && user.roles.includes('ADMIN')).length;
    const userRoleCount = users.filter(user => user.roles && user.roles.includes('USER') && !user.roles.includes('ADMIN')).length;
    const activeUsers = users.filter(user => user.active === true).length;
    
    return {
      totalUsers,
      adminUsers,
      userRoleCount,
      activeUsers,
      newUsersThisMonth: users.filter(user => {
        const createdDate = new Date(user.createdAt);
        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return createdDate >= monthAgo;
      }).length
    };
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8" />
              User Management
            </h1>
            <p className="text-white/70">Manage users, roles, and permissions</p>
          </div>
          <button
            onClick={() => setIsCreateUserModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Create User
          </button>
        </div>
        {dashboardMessage && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300">{dashboardMessage}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">User Role</p>
              <p className="text-2xl font-bold text-white">{stats?.userRoleCount || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Admin Users</p>
              <p className="text-2xl font-bold text-white">{stats?.adminUsers || 0}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats?.activeUsers || 0}</p>
            </div>
            <UserPlus className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">All Users</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/30">
              <tr>
                <th className="text-left py-4 px-6 text-white/70 font-medium">User</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Roles</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Created At</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-black/10' : ''}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.fullName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.fullName}</div>
                        <div className="text-white/50 text-sm">{user.email}</div>
                        <div className="text-white/40 text-xs">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role, roleIndex) => (
                          <span key={roleIndex} className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            role === 'ADMIN' 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                          No roles
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.active === true 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {user.active === true ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white/70 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          user.active === true
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                            : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30'
                        }`}
                      >
                        {user.active === true ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 px-6 text-center text-white/70">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default AdminPage;
