'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User } from '@/types';
import { mockUsers } from '@/utils/mockDatabase';
import { Users, UserPlus, Mail, Shield, Edit, Trash2, Search } from 'lucide-react';

const TeamPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setTeamMembers(mockUsers as User[]);
    }
  }, []);

  const roleColors = {
    applicant: 'bg-blue-100 text-blue-800',
    project_officer: 'bg-green-100 text-green-800',
    program_manager: 'bg-purple-100 text-purple-800',
    medical_officer: 'bg-red-100 text-red-800',
    finance_officer: 'bg-yellow-100 text-yellow-800',
    director: 'bg-indigo-100 text-indigo-800',
    executive_director: 'bg-pink-100 text-pink-800',
    founder: 'bg-gray-100 text-gray-800',
    hospital_admin: 'bg-teal-100 text-teal-800',
    admin: 'bg-orange-100 text-orange-800'
  };

  const filteredMembers = (teamMembers || []).filter(member => {
    const matchesSearch = member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roleStats = (teamMembers || []).reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            </div>
            <p className="text-gray-600">
              Manage team members, roles, and permissions
            </p>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-blue-100">Total Members</p>
                  <p className="text-3xl font-bold">{teamMembers?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Shield className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-green-100">Active Roles</p>
                  <p className="text-3xl font-bold">{Object.keys(roleStats).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <UserPlus className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-purple-100">Staff Members</p>
                  <p className="text-3xl font-bold">
                    {(teamMembers || []).filter(m => m.role !== 'applicant').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Mail className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-orange-100">Departments</p>
                  <p className="text-3xl font-bold">6</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search team members..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="project_officer">Project Officers</option>
                    <option value="program_manager">Program Managers</option>
                    <option value="medical_officer">Medical Officers</option>
                    <option value="finance_officer">Finance Officers</option>
                    <option value="director">Directors</option>
                    <option value="executive_director">Executive Directors</option>
                    <option value="founder">Founders</option>
                    <option value="hospital_admin">Hospital Admins</option>
                    <option value="admin">Administrators</option>
                  </select>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              <p className="text-gray-600 text-sm">Showing {filteredMembers.length} of {teamMembers?.length || 0} members</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {member.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[member.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}`}>
                          {member.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
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

          {/* Role Distribution */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Role Distribution</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(roleStats).map(([role, count]) => (
                  <div key={role} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {role.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeamPage;