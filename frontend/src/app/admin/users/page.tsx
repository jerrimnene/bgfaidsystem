'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User } from '@/types';
import { mockDB, mockUsers } from '@/utils/mockDatabase';
import { Users, UserPlus, Search, Filter, Edit, Trash2, Eye, Shield, Mail, Phone, Calendar, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface AdminUser extends User {
  lastLogin?: string;
  createdDate?: string;
}

const AdminUsersPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<AdminUser | null>(null);

  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'applicant',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    phone: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadUsers();
    }
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const loadUsers = () => {
    // Get users from mock database with additional fields
    const allUsers = mockUsers.map(user => ({
      ...user,
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    })) as AdminUser[];
    setUsers(allUsers);
  };

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    const userToAdd = {
      ...newUser,
      id: `USER-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      lastLogin: undefined
    } as AdminUser;

    mockDB.addUser(userToAdd);
    setUsers([...users, userToAdd]);
    setShowAddModal(false);
    setNewUser({
      first_name: '',
      last_name: '',
      email: '',
      role: 'applicant',
      status: 'active',
      phone: ''
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const success = mockDB.updateUser(editingUser.id, {
      first_name: editingUser.first_name,
      last_name: editingUser.last_name,
      email: editingUser.email,
      role: editingUser.role,
      status: editingUser.status,
      phone: editingUser.phone
    });

    if (success) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userToDelete: AdminUser) => {
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setShowDeleteConfirm(null);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      applicant: 'bg-blue-100 text-blue-800',
      project_officer: 'bg-green-100 text-green-800',
      program_manager: 'bg-purple-100 text-purple-800',
      medical_officer: 'bg-red-100 text-red-800',
      finance_officer: 'bg-yellow-100 text-yellow-800',
      finance_director: 'bg-orange-100 text-orange-800',
      hospital_director: 'bg-pink-100 text-pink-800',
      director: 'bg-indigo-100 text-indigo-800',
      executive_director: 'bg-violet-100 text-violet-800',
      ceo: 'bg-rose-100 text-rose-800',
      founder: 'bg-gray-100 text-gray-800',
      hospital_admin: 'bg-teal-100 text-teal-800',
      admin: 'bg-slate-100 text-slate-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800 rounded-3xl shadow-2xl mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
              <div className="relative px-8 py-12">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h1 className="text-4xl font-bold text-white">User Management</h1>
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl">
                      Manage system users, roles, and permissions across the platform
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">{users.length}</div>
                        <div className="text-sm text-gray-300">Total Users</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">{users.filter(u => u.status === 'active').length}</div>
                        <div className="text-sm text-gray-300">Active Users</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-50"></div>
            </div>

            {/* User Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">TOTAL</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{users.length}</div>
                  <div className="text-blue-100">System Users</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">ACTIVE</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{users.filter(u => u.status === 'active').length}</div>
                  <div className="text-green-100">Active Users</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">ROLES</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{Object.keys(roleStats).length}</div>
                  <div className="text-purple-100">User Roles</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">INACTIVE</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{users.filter(u => u.status !== 'active').length}</div>
                  <div className="text-orange-100">Inactive Users</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 mb-8">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="all">All Roles</option>
                      <option value="applicant">Applicants</option>
                      <option value="project_officer">Project Officers</option>
                      <option value="program_manager">Program Managers</option>
                      <option value="finance_officer">Finance Officers</option>
                      <option value="director">Directors</option>
                      <option value="executive_director">Executive Directors</option>
                      <option value="founder">Founders</option>
                      <option value="admin">Administrators</option>
                    </select>
                    
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:shadow-xl hover:scale-105"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Add User</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">System Users</h2>
                    <p className="text-gray-600">Showing {filteredUsers.length} of {users.length} users</p>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-50/50 px-4 py-2 rounded-xl">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/50">
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <div className={`h-12 w-12 rounded-xl ${index % 4 === 0 ? 'bg-blue-100' : index % 4 === 1 ? 'bg-purple-100' : index % 4 === 2 ? 'bg-green-100' : 'bg-orange-100'} flex items-center justify-center border-2 border-white shadow-sm`}>
                                <span className={`text-lg font-bold ${index % 4 === 0 ? 'text-blue-700' : index % 4 === 1 ? 'text-purple-700' : index % 4 === 2 ? 'text-green-700' : 'text-orange-700'}`}>
                                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.lastLogin ? (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-gray-400">Never</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-100/50 rounded-lg transition-colors"
                              title="Edit user"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="text-green-600 hover:text-green-700 p-2 hover:bg-green-100/50 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(user)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-100/50 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="p-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="applicant">Applicant</option>
                    <option value="project_officer">Project Officer</option>
                    <option value="program_manager">Program Manager</option>
                    <option value="finance_officer">Finance Officer</option>
                    <option value="director">Director</option>
                    <option value="executive_director">Executive Director</option>
                    <option value="founder">Founder</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'active' | 'inactive' | 'suspended' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Edit User</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editingUser.first_name}
                    onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editingUser.last_name}
                    onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="applicant">Applicant</option>
                    <option value="project_officer">Project Officer</option>
                    <option value="program_manager">Program Manager</option>
                    <option value="finance_officer">Finance Officer</option>
                    <option value="director">Director</option>
                    <option value="executive_director">Executive Director</option>
                    <option value="founder">Founder</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setEditingUser(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
            </div>

            <div className="p-8">
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{showDeleteConfirm.first_name} {showDeleteConfirm.last_name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="px-8 py-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AdminUsersPage;