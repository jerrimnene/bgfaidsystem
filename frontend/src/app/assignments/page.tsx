'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { User, UserRole } from '@/types';
import { mockDB, type Application } from '@/utils/mockDatabase';
import { FileText, Clock, CheckCircle, AlertTriangle, Eye, User as UserIcon } from 'lucide-react';

const AssignmentsPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadAssignments(userData.role, userData.email);
    } else {
      router.push('/auth/login');
    }
    setLoading(false);
  }, [router]);

  const loadAssignments = (userRole: string, userEmail: string) => {
    const userAssignments = mockDB.getApplicationsForRole(userRole, userEmail);
    setAssignments(userAssignments);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading assignments...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Required</h2>
            <p className="text-gray-600">Please log in to view your assignments.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Assignments
            </h1>
            <p className="text-gray-600">
              Applications assigned to you for review and processing
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {assignments.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignments List */}
          {assignments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments</h3>
              <p className="text-gray-600">
                You don't have any applications assigned to you at the moment.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Current Assignments</h2>
              </div>
              <div className="divide-y">
                {assignments.map((application) => (
                  <div key={application.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{application.title}</h3>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {application.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <UserIcon className="h-4 w-4" />
                            <span>Applicant: {application.applicant.name}</span>
                          </div>
                          <div>
                            <span>Amount: ${application.amount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span>Submitted: {new Date(application.submittedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Current Step: {application.currentStep?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status === 'pending' ? 'Pending Review' :
                           application.status === 'completed' ? 'Completed' : 
                           application.status}
                        </span>
                        
                        <button
                          onClick={() => router.push('/review')}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AssignmentsPage;