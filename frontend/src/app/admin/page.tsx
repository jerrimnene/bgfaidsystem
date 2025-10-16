'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Mail,
  FileText,
  DollarSign,
  Heart,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  AlertTriangle,
  X
} from 'lucide-react';

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface SystemMetric {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings' | 'reports' | 'system'>('overview');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Mock data
  const systemMetrics: SystemMetric[] = [
    {
      name: 'Total Users',
      value: '347',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      name: 'Active Applications',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      name: 'System Health',
      value: '99.9%',
      change: '0%',
      trend: 'stable',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      name: 'Total Disbursed',
      value: '$245K',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ];

  const mockUsers: AdminUser[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Tangire',
      email: 'john@bridginggap.org',
      role: 'founder',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      firstName: 'Mary',
      lastName: 'Tangire',
      email: 'mary@bridginggap.org',
      role: 'founder',
      status: 'active',
      lastLogin: '2024-01-15T09:45:00Z',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '3',
      firstName: 'Peter',
      lastName: 'Chikwanha',
      email: 'peter@bridginggap.org',
      role: 'project_officer',
      status: 'active',
      lastLogin: '2024-01-15T08:20:00Z',
      createdAt: '2023-03-15T00:00:00Z'
    },
    {
      id: '4',
      firstName: 'Grace',
      lastName: 'Moyo',
      email: 'grace@example.com',
      role: 'applicant',
      status: 'active',
      lastLogin: '2024-01-14T16:30:00Z',
      createdAt: '2023-11-20T00:00:00Z'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'founder': return 'bg-purple-100 text-purple-800';
      case 'ceo': return 'bg-red-100 text-red-800';
      case 'executive_director': return 'bg-orange-100 text-orange-800';
      case 'finance_director': return 'bg-green-100 text-green-800';
      case 'hospital_director': return 'bg-pink-100 text-pink-800';
      case 'program_manager': return 'bg-blue-100 text-blue-800';
      case 'project_officer': return 'bg-cyan-100 text-cyan-800';
      case 'applicant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">System Administration</h1>
          <p className="text-gray-600">Manage users, settings, and system operations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'settings', label: 'System Settings', icon: Settings },
              { id: 'reports', label: 'Admin Reports', icon: FileText },
              { id: 'system', label: 'System Health', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                      </div>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Add New User</p>
                    <p className="text-sm text-gray-600">Create a new system user</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                  <Download className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Export Data</p>
                    <p className="text-sm text-gray-600">Download system reports</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                  <Database className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Backup System</p>
                    <p className="text-sm text-gray-600">Create system backup</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New user registered', user: 'Grace Moyo', time: '2 hours ago', type: 'user' },
                  { action: 'Application approved', user: 'Peter Chikwanha', time: '4 hours ago', type: 'workflow' },
                  { action: 'System backup completed', user: 'System', time: '6 hours ago', type: 'system' },
                  { action: 'Funds disbursed', user: 'Finance Team', time: '1 day ago', type: 'finance' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'workflow' ? 'bg-green-500' :
                        activity.type === 'system' ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                <p className="text-gray-600">Manage system users and their permissions</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-700">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
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
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      defaultValue="Bridging Gap Foundation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="info@bridginggap.org"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+263 123 456 789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Application Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Grant Amount (USD)</label>
                    <input
                      type="number"
                      defaultValue="50000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Scholarship Amount (USD)</label>
                    <input
                      type="number"
                      defaultValue="100000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Require document verification</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Email notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">SMS notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Telegram notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notification Email</label>
                    <input
                      type="email"
                      defaultValue="notifications@bridginggap.org"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Two-factor authentication required</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Strong password requirements</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Reset
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
            
            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Database Status</p>
                    <p className="text-lg font-semibold text-green-600">Healthy</p>
                  </div>
                  <Database className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Server Load</p>
                    <p className="text-lg font-semibold text-blue-600">23%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Uptime</p>
                    <p className="text-lg font-semibold text-purple-600">99.9%</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Logs</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[
                  { time: '2024-01-15 10:30:15', level: 'INFO', message: 'User login successful: grace@example.com' },
                  { time: '2024-01-15 10:25:32', level: 'INFO', message: 'Application submitted: APP-123' },
                  { time: '2024-01-15 10:20:45', level: 'WARN', message: 'High memory usage detected: 85%' },
                  { time: '2024-01-15 10:15:12', level: 'INFO', message: 'Database backup completed successfully' },
                  { time: '2024-01-15 10:10:33', level: 'ERROR', message: 'Failed email delivery to user@example.com' },
                ].map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      log.level === 'INFO' ? 'bg-blue-100 text-blue-800' :
                      log.level === 'WARN' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {log.level}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{log.message}</p>
                      <p className="text-xs text-gray-500">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Role</option>
                  <option value="applicant">Applicant</option>
                  <option value="project_officer">Project Officer</option>
                  <option value="program_manager">Program Manager</option>
                  <option value="finance_director">Finance Director</option>
                  <option value="hospital_director">Hospital Director</option>
                  <option value="executive_director">Executive Director</option>
                  <option value="ceo">CEO</option>
                  <option value="founder">Founder</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle user creation
                  setShowAddUserModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AdminPage;