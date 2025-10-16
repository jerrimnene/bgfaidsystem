'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Settings,
  Shield,
  FileText,
  BarChart3,
  Database,
  Mail,
  Bell,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { User, Application, SystemStats, UserRole } from '@/types';
import { authApi, applicationsApi } from '@/utils/api';

interface AdminDashboardProps {
  user: User;
}

interface SystemHealth {
  database_status: 'healthy' | 'warning' | 'error';
  redis_status: 'healthy' | 'warning' | 'error';
  email_service_status: 'healthy' | 'warning' | 'error';
  notification_service_status: 'healthy' | 'warning' | 'error';
  last_backup: string;
  disk_usage: number;
  memory_usage: number;
  cpu_usage: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch system stats
      const statsResponse = await applicationsApi.getApplicationStats();
      if (statsResponse.success) {
        setSystemStats(statsResponse.data as any);
      }

      // Fetch users
      const usersResponse = await (authApi as any).getAllUsers();
      if (usersResponse.success) {
        setUsers(usersResponse.data || []);
      }

      // Fetch recent applications
      const applicationsResponse = await applicationsApi.getApplications({
        limit: 20,
        sort: 'created_at',
        order: 'desc'
      });
      if (applicationsResponse.success) {
        setApplications(applicationsResponse.data || []);
      }

      // Mock system health data - would come from monitoring service
      setSystemHealth({
        database_status: 'healthy',
        redis_status: 'healthy',
        email_service_status: 'healthy',
        notification_service_status: 'warning',
        last_backup: '2024-01-15T02:00:00Z',
        disk_usage: 65,
        memory_usage: 78,
        cpu_usage: 42
      });

    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      const response = await (authApi as any).updateUserStatus(userId, newStatus);
      if (response.success) {
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        fetchAdminData();
      } else {
        toast.error(response.error || 'Failed to update user status');
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await (authApi as any).deleteUser(userId);
      if (response.success) {
        toast.success('User deleted successfully');
        fetchAdminData();
      } else {
        toast.error(response.error || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage > 90) return 'bg-red-500';
    if (usage > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = searchTerm === '' || 
      u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-blue-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-green-600 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{systemStats?.total_applications || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900">{systemStats?.pending_review || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-purple-600 mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{systemStats?.approved_applications || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Database</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(systemHealth?.database_status || 'unknown')}`}>
                  {systemHealth?.database_status || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Redis</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(systemHealth?.redis_status || 'unknown')}`}>
                  {systemHealth?.redis_status || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Email Service</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(systemHealth?.email_service_status || 'unknown')}`}>
                  {systemHealth?.email_service_status || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Notifications</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(systemHealth?.notification_service_status || 'unknown')}`}>
                  {systemHealth?.notification_service_status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Disk Usage</span>
                <span>{systemHealth?.disk_usage}%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(systemHealth?.disk_usage || 0)}`}
                  style={{ width: `${systemHealth?.disk_usage || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{systemHealth?.memory_usage}%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(systemHealth?.memory_usage || 0)}`}
                  style={{ width: `${systemHealth?.memory_usage || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>{systemHealth?.cpu_usage}%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(systemHealth?.cpu_usage || 0)}`}
                  style={{ width: `${systemHealth?.cpu_usage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            Last backup: {systemHealth?.last_backup ? format(new Date(systemHealth.last_backup), 'PPpp') : 'Unknown'}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.slice(0, 10).map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{application.application_id}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{application.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.applicant_first_name} {application.applicant_last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.type.replace('_', ' ').toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {application.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(application.created_at), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <button 
              onClick={() => setUserModalOpen(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
          
          <div className="flex space-x-4 mt-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
              />
            </div>
            
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="applicant">Applicant</option>
              <option value="project_officer">Project Officer</option>
              <option value="program_manager">Program Manager</option>
              <option value="finance_director">Finance Director</option>
              <option value="hospital_director">Hospital Director</option>
              <option value="executive_director">Executive Director</option>
              <option value="ceo">CEO</option>
              <option value="founder">Founder</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-500">
                          {u.first_name.charAt(0)}{u.last_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {u.first_name} {u.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {u.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.last_login ? format(new Date(u.last_login), 'MMM dd, yyyy') : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setUserModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleUserStatusToggle(u.id, u.status === 'active' ? 'inactive' : 'active')}
                        className={`${u.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {u.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">System management and configuration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>User Management</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
            <p className="text-gray-600">System configuration settings will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;