'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import MEReports from '@/components/reports/MEReports';
import MainLayout from '@/components/layout/MainLayout';
import { mockDB, type Report } from '@/utils/mockDatabase';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download, 
  Users, 
  DollarSign,
  Award,
  Heart,
  RefreshCw
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    totalDisbursed: 0,
    beneficiaries: 0,
    avgProcessingTime: 0,
    successRate: 0
  });
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        loadData();
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
  }, []);

  const loadData = () => {
    const allApplications = mockDB.getAllApplications();
    const allReports = mockDB.getAllReports();
    const workflowStats = mockDB.getWorkflowStats();
    
    // Calculate real stats from applications
    const totalBeneficiaries = allApplications.reduce((sum, app) => sum + (app.beneficiaries || 0), 0);
    const completedApps = allApplications.filter(app => app.status === 'completed');
    const totalDisbursed = completedApps.reduce((sum, app) => sum + app.amount, 0);
    
    // Calculate average processing time
    const avgProcessingTime = completedApps.length > 0 ? 
      Math.round(completedApps.reduce((sum, app) => {
        const submitted = new Date(app.submittedDate);
        const completed = new Date(app.lastUpdated);
        const days = Math.floor((completed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / completedApps.length) : 0;
    
    const successRate = allApplications.length > 0 ? 
      (completedApps.length / allApplications.length) * 100 : 0;

    setStats({
      totalApplications: allApplications.length,
      approvedApplications: completedApps.length,
      totalDisbursed,
      beneficiaries: totalBeneficiaries,
      avgProcessingTime,
      successRate
    });
    
    setReports(allReports);
  };

  const generateNewReport = (type: 'finance' | 'impact' | 'disbursement' | 'medical') => {
    if (!user) return;
    
    const report = mockDB.generateReport(type, dateRange, `${user.first_name} ${user.last_name}`);
    loadData();
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">M&E Reports & Analytics</h1>
          <p className="text-gray-600">Monitor impact, track performance, and generate insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">{((stats.approvedApplications / stats.totalApplications) * 100).toFixed(1)}% approval rate</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Disbursed</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalDisbursed.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+18% from last quarter</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.beneficiaries}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">Individuals helped</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgProcessingTime}d</p>
              </div>
              <RefreshCw className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">-2 days improved</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">Impact achievement</span>
            </div>
          </div>
        </div>

        {/* Report Generation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Generate New Report</h2>
            <p className="text-gray-600 text-sm">Create comprehensive reports for specific time periods</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  Period: {Math.ceil((new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => generateNewReport('finance')}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg"
              >
                <DollarSign className="h-5 w-5" />
                <span>Finance Report</span>
              </button>
              
              <button
                onClick={() => generateNewReport('impact')}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Impact Report</span>
              </button>
              
              <button
                onClick={() => generateNewReport('disbursement')}
                className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Disbursement Report</span>
              </button>
              
              <button
                onClick={() => generateNewReport('medical')}
                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg"
              >
                <Heart className="h-5 w-5" />
                <span>Medical Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generated Reports */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <p className="text-gray-600 text-sm">{reports.length} reports generated</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">Generated by {report.generatedBy} on {new Date(report.generatedDate).toLocaleDateString()}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{report.summary.totalApplications} applications</span>
                      <span>${report.summary.totalAmount.toLocaleString()} total</span>
                      <span>{report.summary.approvalRate.toFixed(1)}% approval rate</span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports generated</h3>
                <p className="mt-1 text-sm text-gray-500">Generate your first report using the form above</p>
              </div>
            )}
          </div>
        </div>

        {/* M&E Component */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
              Detailed M&E Analytics
            </h2>
          </div>
          <MEReports user={user} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download Full Report</span>
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Generate Impact Summary</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
