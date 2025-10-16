'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WorkflowManager from '@/components/workflow/WorkflowManager';
import { User } from '@/types';
import { mockDB, type Application } from '@/utils/mockDatabase';
import { Crown, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const ExecutivePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadExecutiveApplications(userData.role, userData.email);
    }
  }, []);

  const loadExecutiveApplications = (userRole: string, userEmail: string) => {
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
      loadExecutiveApplications(user.role, user.email);
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Crown className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Executive Review</h1>
            </div>
            <p className="text-gray-600">
              High-level executive review and strategic decision making
            </p>
          </div>

          {/* Executive Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <FileText className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-purple-100">Executive Review Queue</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <CheckCircle className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-green-100">Strategic Value</p>
                  <p className="text-3xl font-bold">
                    ${applications.reduce((sum, app) => sum + app.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <AlertTriangle className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-orange-100">Priority Items</p>
                  <p className="text-3xl font-bold">
                    {applications.filter(app => app.amount > 10000).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Level Instructions */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Executive Review Guidelines</h3>
            <div className="text-purple-700 text-sm space-y-1">
              <p>• Focus on strategic alignment with organizational goals</p>
              <p>• Consider long-term impact and sustainability</p>
              <p>• Evaluate resource allocation efficiency</p>
              <p>• Assess risk factors and mitigation strategies</p>
            </div>
          </div>

          {/* Workflow Manager */}
          <div className="bg-white rounded-lg shadow">
            <WorkflowManager
              userRole={user?.role || 'executive_director'}
              applications={applications}
              onUpdateApplication={handleApplicationUpdate}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExecutivePage;