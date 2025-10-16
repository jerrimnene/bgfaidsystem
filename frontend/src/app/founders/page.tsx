'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WorkflowManager from '@/components/workflow/WorkflowManager';
import { User } from '@/types';
import { mockDB, type Application } from '@/utils/mockDatabase';
import { Users, Shield, TrendingUp, DollarSign } from 'lucide-react';

const FoundersPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadFoundersApplications(userData.role, userData.email);
    }
  }, []);

  const loadFoundersApplications = (userRole: string, userEmail: string) => {
    const roleApplications = mockDB.getApplicationsForRoleSync(userRole, userEmail);
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
      loadFoundersApplications(user.role, user.email);
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Founders Approval</h1>
            </div>
            <p className="text-gray-600">
              Final approval stage for significant funding decisions
            </p>
          </div>

          {/* Founders Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Shield className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-blue-100">Founders Review</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-green-100">Total Value</p>
                  <p className="text-3xl font-bold">
                    ${applications.reduce((sum, app) => sum + app.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-purple-100">High Impact</p>
                  <p className="text-3xl font-bold">
                    {applications.filter(app => app.amount > 15000).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-orange-100">Beneficiaries</p>
                  <p className="text-3xl font-bold">
                    {applications.reduce((sum, app) => sum + (app.beneficiaries || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Founders Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Founders Approval Criteria</h3>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• Alignment with foundation's core mission and values</p>
              <p>• Long-term sustainability and impact potential</p>
              <p>• Resource allocation and organizational capacity</p>
              <p>• Strategic partnerships and collaboration opportunities</p>
              <p>• Risk assessment and mitigation strategies</p>
            </div>
          </div>

          {/* Application Review Section */}
          <div className="bg-white rounded-lg shadow">
            <WorkflowManager
              userRole={user?.role || 'founder'}
              applications={applications}
              onUpdateApplication={handleApplicationUpdate}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FoundersPage;