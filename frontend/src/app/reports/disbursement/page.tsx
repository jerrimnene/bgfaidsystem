'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User } from '@/types';
import { mockDB, type Report } from '@/utils/mockDatabase';
import { Activity, Send, Clock, CheckCircle, AlertCircle, Download, Calendar, BarChart3, CreditCard, ArrowUpRight } from 'lucide-react';

const DisbursementReportsPage: React.FC = () => {
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
      loadDisbursementReports();
    }
  }, []);

  const loadDisbursementReports = () => {
    const disbursementReports = mockDB.getReportsByType('disbursement');
    setReports(disbursementReports);
    if (disbursementReports.length > 0) {
      setSelectedReport(disbursementReports[0]);
    }
  };

  const generateNewReport = () => {
    if (!user) return;
    
    const report = mockDB.generateReport('disbursement', dateRange, `${user.first_name} ${user.last_name}`);
    loadDisbursementReports();
  };

  const applications = mockDB.getAllApplications();
  const completedDisbursements = applications.filter(app => app.status === 'completed');
  const pendingDisbursements = applications.filter(app => app.status === 'pending');
  const totalDisbursed = completedDisbursements.reduce((sum, app) => sum + app.amount, 0);
  const pendingAmount = pendingDisbursements.reduce((sum, app) => sum + app.amount, 0);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-3xl shadow-2xl mb-10">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
              <div className="relative px-8 py-12">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Activity className="h-8 w-8 text-white" />
                      </div>
                      <h1 className="text-4xl font-bold text-white">Disbursement Analytics</h1>
                    </div>
                    <p className="text-xl text-green-100 max-w-2xl">
                      Track and analyze fund disbursements, processing times, and payment methods
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">${totalDisbursed.toLocaleString()}</div>
                        <div className="text-sm text-green-100">Total Disbursed</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">${pendingAmount.toLocaleString()}</div>
                        <div className="text-sm text-green-100">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-60"></div>
            </div>

            {/* Disbursement Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">COMPLETED</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">${totalDisbursed.toLocaleString()}</div>
                  <div className="text-green-100 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Total Disbursed
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">PENDING</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">${pendingAmount.toLocaleString()}</div>
                  <div className="text-orange-100">Awaiting Release</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Send className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">ACTIVE</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{completedDisbursements.length}</div>
                  <div className="text-blue-100">Disbursements Made</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CreditCard className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">REPORTS</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{reports.length}</div>
                  <div className="text-purple-100">Analytics Reports</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>
            </div>

            {/* Report Generation Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 mb-10">
              <div className="px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Generate Disbursement Report
                    </h2>
                    <p className="text-gray-600">Create detailed disbursement analysis for specified period</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={generateNewReport}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-xl hover:scale-105"
                    >
                      <Activity className="h-5 w-5" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50/50 rounded-xl py-2">
                  Analysis Period: {Math.ceil((new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reports List */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-bold text-gray-800">Disbursement Reports</h2>
                    <p className="text-gray-600 text-sm">{reports.length} reports available</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {reports.map((report, index) => (
                      <div
                        key={report.id}
                        className={`p-5 border-b border-gray-100/50 cursor-pointer transition-all duration-200 hover:bg-green-50/50 ${
                          selectedReport?.id === report.id ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500' : ''
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${index % 3 === 0 ? 'bg-green-500' : index % 3 === 1 ? 'bg-emerald-500' : 'bg-teal-500'}`}></div>
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{report.title}</h3>
                          </div>
                          <button className="text-green-600 hover:text-green-700 p-1 hover:bg-green-100/50 rounded-lg transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.generatedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{report.summary.totalApplications} transactions</span>
                          <span className="font-medium text-green-600">${report.summary.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    {reports.length === 0 && (
                      <div className="p-12 text-center">
                        <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Disbursement Reports</h3>
                        <p className="text-gray-500 text-sm">Generate your first disbursement report</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="lg:col-span-2">
                {selectedReport ? (
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
                    <div className="px-8 py-6 border-b border-gray-200/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedReport.title}</h2>
                          <p className="text-gray-600">
                            Generated by {selectedReport.generatedBy} on {new Date(selectedReport.generatedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:shadow-lg hover:scale-105">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200/50">
                          <div className="text-2xl font-bold text-green-700">{selectedReport.summary.totalApplications}</div>
                          <div className="text-sm text-green-600">Transactions</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200/50">
                          <div className="text-2xl font-bold text-emerald-700">${selectedReport.summary.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-emerald-600">Total Amount</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50">
                          <div className="text-2xl font-bold text-blue-700">{selectedReport.summary.approvalRate.toFixed(1)}%</div>
                          <div className="text-sm text-blue-600">Success Rate</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200/50">
                          <div className="text-2xl font-bold text-orange-700">{selectedReport.summary.averageProcessingTime}d</div>
                          <div className="text-sm text-orange-600">Avg Processing</div>
                        </div>
                      </div>

                      {/* Disbursement Analysis */}
                      {selectedReport.data && (
                        <div className="space-y-8">
                          {/* Disbursement Methods */}
                          {selectedReport.data.disbursementMethods && (
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50">
                              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                                <CreditCard className="h-6 w-6 mr-2" />
                                Payment Methods
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(selectedReport.data.disbursementMethods).map(([method, count]) => (
                                  <div key={method} className="bg-white/50 p-4 rounded-xl text-center border border-blue-200/30">
                                    <div className="text-2xl font-bold text-blue-700 mb-1">{String(count)}</div>
                                    <div className="text-blue-600 text-sm capitalize">{method.replace('_', ' ')}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Processing Times */}
                          {selectedReport.data.processingTimes && (
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                                <Clock className="h-6 w-6 mr-2" />
                                Processing Performance
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/50 p-4 rounded-xl border border-purple-200/30">
                                  <div className="text-2xl font-bold text-purple-700 mb-1">
                                    {selectedReport.data.processingTimes.length > 0 ? 
                                      Math.round(selectedReport.data.processingTimes.reduce((a: number, b: number) => a + b, 0) / selectedReport.data.processingTimes.length) : 0}d
                                  </div>
                                  <div className="text-purple-600">Average Processing Time</div>
                                </div>
                                <div className="bg-white/50 p-4 rounded-xl border border-purple-200/30">
                                  <div className="text-2xl font-bold text-pink-700 mb-1">
                                    {selectedReport.data.processingTimes.length > 0 ? 
                                      Math.min(...selectedReport.data.processingTimes) : 0}d
                                  </div>
                                  <div className="text-pink-600">Fastest Processing</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Failure Analysis */}
                          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200/50">
                            <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                              <AlertCircle className="h-6 w-6 mr-2" />
                              Quality Metrics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white/50 p-4 rounded-xl text-center border border-orange-200/30">
                                <div className="text-2xl font-bold text-green-700 mb-1">
                                  {(100 - (selectedReport.data.failureRates || 0)).toFixed(1)}%
                                </div>
                                <div className="text-green-600">Success Rate</div>
                              </div>
                              <div className="bg-white/50 p-4 rounded-xl text-center border border-orange-200/30">
                                <div className="text-2xl font-bold text-orange-700 mb-1">
                                  {selectedReport.data.failureRates?.toFixed(1) || 0}%
                                </div>
                                <div className="text-orange-600">Failure Rate</div>
                              </div>
                              <div className="bg-white/50 p-4 rounded-xl text-center border border-orange-200/30">
                                <div className="text-2xl font-bold text-blue-700 mb-1">99.5%</div>
                                <div className="text-blue-600">Reliability Score</div>
                              </div>
                            </div>
                          </div>

                          {/* Total Disbursements Overview */}
                          {selectedReport.data.totalDisbursements && (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                              <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
                                <Send className="h-6 w-6 mr-2" />
                                Disbursement Summary
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/50 p-4 rounded-xl border border-emerald-200/30">
                                  <div className="text-2xl font-bold text-emerald-700 mb-1">
                                    {selectedReport.data.totalDisbursements.length || 0}
                                  </div>
                                  <div className="text-emerald-600">Total Transactions</div>
                                </div>
                                <div className="bg-white/50 p-4 rounded-xl border border-emerald-200/30">
                                  <div className="text-2xl font-bold text-teal-700 mb-1">
                                    ${selectedReport.summary.totalAmount.toLocaleString()}
                                  </div>
                                  <div className="text-teal-600">Total Volume</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
                    <Activity className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Disbursement Report</h3>
                    <p className="text-gray-600">Choose a report from the list to view detailed disbursement analysis</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DisbursementReportsPage;