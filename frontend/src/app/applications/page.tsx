'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  MessageCircle,
  DollarSign,
  RefreshCw,
  Plus
} from 'lucide-react';
import { User as UserType } from '@/types';
import { mockDB, type Application } from '@/utils/mockDatabase';
import { useRouter } from 'next/navigation';

const ApplicationsPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadApplications(parsedUser.email);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setLoading(false);
  };

  const loadApplications = (userEmail: string) => {
    // Load applications for this user
    const userApplications = mockDB.getApplicationsByApplicant(userEmail);
    setApplications(userApplications);
  };

  const refreshApplications = () => {
    if (user) {
      loadApplications(user.email);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
      default:
        return 'In Review';
    }
  };

  const calculateProgress = (workflow: any[]) => {
    const completed = workflow.filter(step => step.status === 'approved' || step.status === 'completed').length;
    return Math.round((completed / workflow.length) * 100);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600 mt-1">Track the status of your submitted applications</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshApplications}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => router.push('/applications/new')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Application</span>
              </button>
            </div>
          </div>

          {/* Applications Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Review</p>
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
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${applications.reduce((sum, app) => sum + app.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any applications yet. Start by creating your first application.
              </p>
              <button
                onClick={() => router.push('/applications/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Application
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applications.map((application) => (
                <div key={application.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{application.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {application.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedApplication(selectedApplication?.id === application.id ? null : application)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Application ID:</span>
                        <span className="font-mono text-gray-900">{application.id}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-gray-900">${application.amount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="text-gray-900">{new Date(application.submittedDate).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current Step:</span>
                        <span className="text-gray-900 capitalize">
                          {application.currentStep?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{calculateProgress(application.workflow)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${calculateProgress(application.workflow)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Workflow Details */}
                    {selectedApplication?.id === application.id && (
                      <div className="mt-6 border-t pt-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Application Timeline</h4>
                        <div className="space-y-4">
                          {application.workflow.map((step, index) => (
                            <div key={step.id || index} className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                step.status === 'completed' || step.status === 'approved' ? 'bg-green-100' :
                                step.actionRequired ? 'bg-blue-100' : 'bg-gray-100'
                              }`}>
                                {(step.status === 'completed' || step.status === 'approved') ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : step.actionRequired ? (
                                  <Clock className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900">
                                    {step.step.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </p>
                                  {step.actionDate && (
                                    <p className="text-xs text-gray-500">
                                      {new Date(step.actionDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                {step.reviewerName && (
                                  <p className="text-xs text-gray-600 mt-1">Reviewer: {step.reviewerName}</p>
                                )}
                                {step.comments && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                                    <MessageCircle className="w-3 h-3 inline mr-1" />
                                    {step.comments}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Documents */}
                        {application.documents.length > 0 && (
                          <div className="mt-6 border-t pt-4">
                            <h5 className="text-sm font-semibold text-gray-900 mb-3">Submitted Documents</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {application.documents.map((doc, index) => (
                                <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                                  <FileText className="w-3 h-3" />
                                  <span>{doc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplicationsPage;