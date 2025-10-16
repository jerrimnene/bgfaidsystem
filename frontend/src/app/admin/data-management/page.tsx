'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockDB } from '@/utils/mockDatabase';
import { Trash2, RefreshCw, Database, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DataManagementPage: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await mockDB.getWorkflowStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleClearAllData = async () => {
    if (confirm('Are you sure you want to clear all application data? This action cannot be undone.')) {
      try {
        await mockDB.clearAllApplications();
        toast.success('All application data has been cleared');
        // Reload stats after clearing
        const statsData = await mockDB.getWorkflowStats();
        setStats(statsData);
      } catch (error) {
        toast.error('Failed to clear data');
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
            <p className="text-gray-600">Manage system data for testing purposes</p>
          </div>

          {/* Current Stats */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Current Database Statistics
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading statistics...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Applications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Actions</h2>
            
            <div className="space-y-4">
              <div className="border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-red-800 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Clear All Data
                    </h3>
                    <p className="text-sm text-red-600 mt-1">
                      Remove all applications from the system. This will reset the database to empty state.
                    </p>
                  </div>
                  <button
                    onClick={handleClearAllData}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 flex items-center">
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Refresh Page
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Reload the page to see updated statistics after changes.
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Testing Instructions</h2>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>To test the complete workflow:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Clear all data to start fresh</li>
                <li>Login as applicant (applicant@bgf.com / password123)</li>
                <li>Submit a new application</li>
                <li>Login as each staff member in sequence to process the application:</li>
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Project Officer: project.officer@bgf.com</li>
                  <li>Programs Manager: program.manager@bgf.com</li>
                  <li>Finance Director: finance.director@bgf.com</li>
                  <li>Executive Director: executive.director@bgf.com</li>
                  <li>CEO: ceo@bgf.com</li>
                  <li>Founders: founder.male@bgf.com or founder.female@bgf.com</li>
                </ul>
                <li>Track the application through each stage</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DataManagementPage;