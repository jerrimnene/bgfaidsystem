'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WorkflowManager from '@/components/workflow/WorkflowManager';
import { User } from '@/types';
import { mockDB, type Application } from '@/utils/mockDatabase';
import { CheckCircle, Clock, FileText, DollarSign } from 'lucide-react';

const ApprovePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadApplicationsForApproval(userData.role, userData.email);
    }
    setLoading(false);
  }, []);

  const loadApplicationsForApproval = (userRole: string, userEmail: string) => {
    const roleApplications = mockDB.getApplicationsForRole(userRole, userEmail);
    setApplications(roleApplications);
  };

  const handleApplicationUpdate = (applicationId: string, action: string, comment?: string) => {
    if (!user) return;
    
    const success = mockDB.updateApplicationWorkflow(
      applicationId,
      action as 'approve' | 'reject' | 'request_edit',
      user.email,
      `${user.first_name} ${user.last_name}`,
      comment
    );
    
    if (success) {
      loadApplicationsForApproval(user.role, user.email);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applications for approval...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Approve Applications</h1>
            <p className="text-gray-600">
              Review and approve applications at the {user?.role.replace('_', ' ')} level
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Awaiting Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${applications.reduce((sum, app) => sum + app.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Manager */}
          <div className="bg-white rounded-lg shadow">
            <WorkflowManager
              userRole={user?.role || 'finance_director'}
              applications={applications}
              onUpdateApplication={handleApplicationUpdate}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApprovePage;