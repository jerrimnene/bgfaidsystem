'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User } from '@/types';
import { mockDB, type Application } from '@/utils/mockDatabase';
import { FileText, Users, ArrowRight, CheckCircle } from 'lucide-react';

const AssignPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadApplications();
    }
  }, []);

  const loadApplications = () => {
    const allApplications = mockDB.getAllApplications();
    setApplications(allApplications);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Applications</h1>
            <p className="text-gray-600">Manage application assignments and distribution</p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Application Assignment</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-700">Total Applications</p>
                      <p className="text-2xl font-bold text-blue-900">{applications.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-700">Pending Assignment</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {applications.filter(app => app.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-700">Assigned</p>
                      <p className="text-2xl font-bold text-green-900">
                        {applications.filter(app => app.currentReviewer).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-gray-600">
                  This page would contain application assignment functionality. 
                  In the current workflow, applications are automatically assigned to the next reviewer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AssignPage;