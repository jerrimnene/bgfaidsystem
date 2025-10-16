'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { mockDB } from '@/utils/mockDatabase';

export default function ApplicationStatusPage() {
  const [applicationId, setApplicationId] = useState('');
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!applicationId.trim()) return;
    
    setLoading(true);
    setNotFound(false);
    
    // Simulate search delay
    setTimeout(() => {
      const app = mockDB.getApplication(applicationId.trim());
      if (app) {
        setApplication(app);
        setNotFound(false);
      } else {
        setApplication(null);
        setNotFound(true);
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-blue-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/apply" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Applications</span>
            </Link>
            <div className="ml-8 flex items-center space-x-3">
              <img 
                src="/bgf-logo.png" 
                alt="Bridging Gaps Foundation" 
                className="h-8 w-auto"
              />
              <div>
                <h1 className="font-bold text-gray-900">Application Status</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Application Status</h1>
            <p className="text-lg text-gray-600">
              Enter your application reference number to check the current status
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder="Enter Application ID (e.g., APP-ABC123)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !applicationId.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {notFound && (
          <div className="bg-red-50 rounded-xl p-8 text-center border border-red-200">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">Application Not Found</h2>
            <p className="text-red-700 mb-6">
              We couldn't find an application with the reference number "{applicationId}". 
              Please check your reference number and try again.
            </p>
            <div className="text-sm text-red-600">
              <p>Make sure you:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Enter the complete reference number</li>
                <li>Check for typos or extra spaces</li>
                <li>Use the exact format provided in your confirmation</li>
              </ul>
            </div>
          </div>
        )}

        {application && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Application Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{application.title}</h2>
                  <p className="text-blue-100">Reference: {application.id}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(application.status)} bg-white`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-2 font-semibold capitalize">{application.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Applicant:</span>
                      <span className="font-medium text-gray-900 ml-2">{application.applicant.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 ml-2 capitalize">
                        {application.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-gray-900 ml-2">
                        ${application.amount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium text-gray-900 ml-2">
                        {new Date(application.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900 ml-2 capitalize">{application.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current Step:</span>
                      <span className="font-medium text-gray-900 ml-2">{application.currentStep}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium text-gray-900 ml-2">
                        {new Date(application.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">What's Happening Now?</h4>
                <p className="text-blue-800">
                  {application.status === 'pending' && 
                    `Your application is currently under review. We'll contact you if we need any additional information.`
                  }
                  {application.status === 'approved' && 
                    `Congratulations! Your application has been approved. You should receive further instructions via email.`
                  }
                  {application.status === 'rejected' && 
                    `Unfortunately, your application was not approved at this time. You may reapply in the future.`
                  }
                </p>
              </div>

              {/* Contact Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Need Help?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-600 mb-2">For questions about your application:</p>
                    <p className="font-medium">applications@bgfzim.org</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Phone support:</p>
                    <p className="font-medium">+263 XX XXX XXXX</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Always reference your application ID ({application.id}) when contacting us.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!application && !notFound && (
          <div className="bg-blue-50 rounded-xl p-8 text-center border border-blue-200">
            <AlertTriangle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-900 mb-4">Don't have your reference number?</h3>
            <p className="text-blue-800 mb-6">
              Check your email confirmation or contact our support team for assistance.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="mailto:applications@bgfzim.org" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Email Support
              </a>
              <a 
                href="tel:+263000000000" 
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                Call Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}