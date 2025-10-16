'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WorkflowManager from '@/components/workflow/WorkflowManager';
import { User } from '@/types';
import { mockDB, type Application } from '@/utils/mockDatabase';
import { CreditCard, DollarSign, Clock, CheckSquare, AlertCircle } from 'lucide-react';

const FinanceReleasePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadFinanceApplications(userData.role, userData.email);
    }
  }, []);

  const loadFinanceApplications = (userRole: string, userEmail: string) => {
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
      loadFinanceApplications(user.role, user.email);
    }
  };

  const totalAmount = applications.reduce((sum, app) => sum + app.amount, 0);
  const urgentReleases = applications.filter(app => app.priority === 'urgent').length;

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <CreditCard className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Finance Release</h1>
            </div>
            <p className="text-gray-600">
              Process fund releases for approved applications
            </p>
          </div>

          {/* Finance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-green-100">Total Release Value</p>
                  <p className="text-3xl font-bold">${totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <CheckSquare className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-blue-100">Pending Releases</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <AlertCircle className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-orange-100">Urgent Releases</p>
                  <p className="text-3xl font-bold">{urgentReleases}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Clock className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-purple-100">Processing Time</p>
                  <p className="text-3xl font-bold">2-3 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Finance Release Guidelines */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Finance Release Process</h3>
            <div className="text-green-700 text-sm space-y-1">
              <p>• Verify all documentation and approval signatures</p>
              <p>• Confirm bank details and account verification</p>
              <p>• Review disbursement schedule and milestones</p>
              <p>• Process fund transfer and generate receipts</p>
              <p>• Update recipient notification and tracking systems</p>
            </div>
          </div>

          {/* Release Processing Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Fund Release Queue</h2>
              <p className="text-gray-600 text-sm">Review and process approved applications for fund release</p>
            </div>
            
            <WorkflowManager
              userRole={user?.role || 'finance_officer'}
              applications={applications}
              onUpdateApplication={handleApplicationUpdate}
            />
          </div>

          {/* Additional Finance Tools */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded border border-green-200 text-green-800">
                  Generate Disbursement Report
                </button>
                <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-blue-800">
                  Verify Bank Details
                </button>
                <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 text-purple-800">
                  Schedule Bulk Transfer
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Compliance Checklist</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 text-green-600 mr-2" />
                  <span>Anti-money laundering verification</span>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 text-green-600 mr-2" />
                  <span>Tax compliance documentation</span>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 text-green-600 mr-2" />
                  <span>Audit trail maintenance</span>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 text-green-600 mr-2" />
                  <span>Regulatory reporting requirements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FinanceReleasePage;