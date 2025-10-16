'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User } from '@/types';
import { mockDB, type Report } from '@/utils/mockDatabase';
import { DollarSign, TrendingUp, BarChart3, Download, Calendar, PieChart, LineChart } from 'lucide-react';

const FinanceReportsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadFinanceReports();
    }
  }, []);

  const loadFinanceReports = () => {
    const financeReports = mockDB.getReportsByType('finance');
    setReports(financeReports);
    if (financeReports.length > 0) {
      setSelectedReport(financeReports[0]);
    }
  };

  const generateNewReport = () => {
    if (!user) return;
    
    const report = mockDB.generateReport('finance', dateRange, `${user.first_name} ${user.last_name}`);
    loadFinanceReports();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Finance Reports</h1>
            </div>
            <p className="text-gray-600">
              Comprehensive financial analysis and disbursement tracking
            </p>
          </div>

          {/* Quick Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-green-100">Total Disbursed</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(mockDB.getAllApplications().filter(app => app.status === 'completed').reduce((sum, app) => sum + app.amount, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-blue-100">Pending Amount</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(mockDB.getAllApplications().filter(app => app.status === 'pending').reduce((sum, app) => sum + app.amount, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <BarChart3 className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-purple-100">Finance Reports</p>
                  <p className="text-3xl font-bold">{reports.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <PieChart className="h-10 w-10" />
                <div className="ml-4">
                  <p className="text-orange-100">Avg Grant Size</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(mockDB.getAllApplications().length > 0 ? 
                      mockDB.getAllApplications().reduce((sum, app) => sum + app.amount, 0) / mockDB.getAllApplications().length : 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Generation */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Generate Finance Report</h2>
              <p className="text-gray-600 text-sm">Create detailed financial analysis for specified period</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    Period: {Math.ceil((new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={generateNewReport}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reports List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Finance Reports</h2>
                  <p className="text-gray-600 text-sm">{reports.length} reports available</p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedReport?.id === report.id ? 'bg-green-50 border-green-200' : ''
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{report.title}</h3>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(report.generatedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <button className="text-green-600 hover:text-green-700">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {report.summary.totalApplications} apps • {formatCurrency(report.summary.totalAmount)}
                      </div>
                    </div>
                  ))}
                  {reports.length === 0 && (
                    <div className="p-8 text-center">
                      <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No finance reports</h3>
                      <p className="mt-1 text-sm text-gray-500">Generate your first finance report</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div className="lg:col-span-2">
              {selectedReport ? (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{selectedReport.title}</h2>
                        <p className="text-gray-600 text-sm">
                          Generated by {selectedReport.generatedBy} on {new Date(selectedReport.generatedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{selectedReport.summary.totalApplications}</div>
                        <div className="text-sm text-gray-600">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(selectedReport.summary.totalAmount)}</div>
                        <div className="text-sm text-gray-600">Total Amount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{selectedReport.summary.approvalRate.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Approval Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{selectedReport.summary.averageProcessingTime}d</div>
                        <div className="text-sm text-gray-600">Avg Processing</div>
                      </div>
                    </div>

                    {/* Financial Breakdown */}
                    {selectedReport.data && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Overview</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between">
                                <span className="text-green-800 font-medium">Total Disbursed</span>
                                <span className="text-2xl font-bold text-green-900">
                                  {formatCurrency(selectedReport.data.totalDisbursed || 0)}
                                </span>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <span className="text-blue-800 font-medium">Pending Disbursements</span>
                                <span className="text-2xl font-bold text-blue-900">
                                  {formatCurrency(selectedReport.data.pendingDisbursements || 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedReport.data.applicationsByType && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Applications by Type</h3>
                            <div className="space-y-2">
                              {Object.entries(selectedReport.data.applicationsByType).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                  <span className="capitalize text-gray-700">{type.replace('_', ' ')}</span>
                                  <span className="font-semibold text-gray-900">{String(count)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedReport.data.monthlyTrends && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Monthly Trends</h3>
                            <div className="space-y-2">
                              {Object.entries(selectedReport.data.monthlyTrends).map(([month, amount]) => (
                                <div key={month} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                  <span className="text-gray-700">{new Date(month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                  <span className="font-semibold text-gray-900">{formatCurrency(amount as number)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <LineChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Select a Report</h3>
                  <p className="mt-1 text-gray-500">Choose a finance report from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FinanceReportsPage;