'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WorkflowManager from '@/components/workflow/WorkflowManager';
import { User } from '@/types';
import { mockDB, type Application } from '@/utils/mockDatabase';
import { Building, Heart, Users2, Calendar, CheckCircle2 } from 'lucide-react';

const HospitalAcceptancePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadHospitalApplications(userData.role, userData.email);
    }
  }, []);

  const loadHospitalApplications = (userRole: string, userEmail: string) => {
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
      loadHospitalApplications(user.role, user.email);
    }
  };

  const medicalApplications = applications.filter(app => 
    app.categories?.includes('Medical Care') || app.type?.includes('medical')
  );
  const totalBeneficiaries = applications.reduce((sum, app) => sum + (app.beneficiaries || 0), 0);

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Building className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Hospital Acceptance</h1>
            </div>
            <p className="text-gray-600">
              Hospital and medical facility acceptance for patient care funding
            </p>
          </div>

          {/* Hospital Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Building className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-blue-100">Applications</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Heart className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-red-100">Medical Cases</p>
                  <p className="text-3xl font-bold">{medicalApplications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users2 className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-green-100">Patients</p>
                  <p className="text-3xl font-bold">{totalBeneficiaries}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Calendar className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-purple-100">Avg Processing</p>
                  <p className="text-3xl font-bold">48h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Hospital Acceptance Criteria</h3>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• Verify hospital accreditation and medical licensing</p>
              <p>• Confirm treatment capacity and specialized care availability</p>
              <p>• Review patient eligibility and medical documentation</p>
              <p>• Assess treatment plan and estimated costs</p>
              <p>• Ensure compliance with medical standards and protocols</p>
            </div>
          </div>

          {/* Medical Information Panel */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                Medical Care Standards
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800">Quality Assurance</h3>
                  <p className="text-sm text-gray-600">Verified medical standards and care protocols</p>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800">Patient Safety</h3>
                  <p className="text-sm text-gray-600">Comprehensive safety measures and monitoring</p>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800">Treatment Excellence</h3>
                  <p className="text-sm text-gray-600">Evidence-based treatment approaches</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Review Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Patient Acceptance Review</h2>
              <p className="text-gray-600 text-sm">Review and confirm hospital acceptance for patient care</p>
            </div>
            
            <WorkflowManager
              userRole={user?.role || 'hospital_admin'}
              applications={applications}
              onUpdateApplication={handleApplicationUpdate}
            />
          </div>

          {/* Hospital Resources */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hospital Resources</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-blue-800">
                  Bed Availability Status
                </button>
                <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded border border-green-200 text-green-800">
                  Specialist Availability
                </button>
                <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 text-purple-800">
                  Equipment & Facilities
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Patient Care Checklist</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Medical history review</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Treatment plan approval</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Insurance verification</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Care team assignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HospitalAcceptancePage;