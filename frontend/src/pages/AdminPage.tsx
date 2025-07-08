import React, { useEffect, useState } from 'react';
import {
  getUsers,
  getUserStats,
  updateUser,
  deleteUser,
  toggleUserStatus,
  sendNotification,
  UserWithStats
} from '../api/adminApi';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Activity, UserPlus, MoreHorizontal } from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  if (user?.role !== 'admin') {
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
        // Mock data for development since backend might not be implemented yet
        const mockUsers: UserWithStats[] = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-20T14:45:00Z',
            lastLogin: '2024-01-20T14:45:00Z',
            bookmarkCount: 25,
            collectionCount: 5,
            isActive: true
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'admin',
            createdAt: '2024-01-10T08:15:00Z',
            updatedAt: '2024-01-21T16:20:00Z',
            lastLogin: '2024-01-21T16:20:00Z',
            bookmarkCount: 42,
            collectionCount: 8,
            isActive: true
          },
          {
            id: 3,
            name: 'Bob Wilson',
            email: 'bob@example.com',
            role: 'user',
            createdAt: '2024-01-12T12:00:00Z',
            updatedAt: '2024-01-18T09:30:00Z',
            lastLogin: '2024-01-18T09:30:00Z',
            bookmarkCount: 8,
            collectionCount: 2,
            isActive: false
          }
        ];

        const mockStats = {
          totalUsers: 3,
          activeUsers: 2,
          inactiveUsers: 1,
          adminUsers: 1,
          newUsersThisMonth: 2
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setUsers(mockUsers);
        setStats(mockStats);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleStatus = async (userId: number) => {
    try {
      // Mock implementation - in real app this would call the API
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: !user.isActive }
          : user
      ));
      
      // Update stats
      const toggledUser = users.find(u => u.id === userId);
      if (toggledUser) {
        setStats((prev: any) => ({
          ...prev,
          activeUsers: toggledUser.isActive ? prev.activeUsers - 1 : prev.activeUsers + 1,
          inactiveUsers: toggledUser.isActive ? prev.inactiveUsers + 1 : prev.inactiveUsers - 1
        }));
      }
    } catch (error) {
      console.error('Failed to toggle status', error);
      setError('Failed to update user status.');
    }
  };

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
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8" />
          User Management
        </h1>
        <p className="text-white/70">Manage users, roles, and permissions</p>
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
              <p className="text-white/70 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats?.activeUsers || 0}</p>
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
              <p className="text-white/70 text-sm font-medium">New This Month</p>
              <p className="text-2xl font-bold text-white">{stats?.newUsersThisMonth || 0}</p>
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
                <th className="text-left py-4 px-6 text-white/70 font-medium">Role</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Bookmarks</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Last Login</th>
                <th className="text-left py-4 px-6 text-white/70 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-black/10' : ''}`}>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-white/50 text-sm">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white">{user.bookmarkCount}</td>
                  <td className="py-4 px-6 text-white/70 text-sm">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          user.isActive
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                            : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
