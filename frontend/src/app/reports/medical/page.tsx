'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User } from '@/types';
import { mockDB, type Report } from '@/utils/mockDatabase';
import { Heart, Users, Building, Stethoscope, Download, Calendar, BarChart3, Activity, Shield, Plus } from 'lucide-react';

const MedicalReportsPage: React.FC = () => {
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
      loadMedicalReports();
    }
  }, []);

  const loadMedicalReports = () => {
    const medicalReports = mockDB.getReportsByType('medical');
    setReports(medicalReports);
    if (medicalReports.length > 0) {
      setSelectedReport(medicalReports[0]);
    }
  };

  const generateNewReport = () => {
    if (!user) return;
    
    const report = mockDB.generateReport('medical', dateRange, `${user.first_name} ${user.last_name}`);
    loadMedicalReports();
  };

  const applications = mockDB.getAllApplicationsSync();
  const medicalApplications = applications.filter(app => app.type === 'medical_assistance');
  const completedMedical = medicalApplications.filter(app => app.status === 'completed');
  const totalMedicalValue = completedMedical.reduce((sum, app) => sum + app.amount, 0);
  const patientsHelped = completedMedical.reduce((sum, app) => sum + (app.beneficiaries || 1), 0);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-rose-700 rounded-3xl shadow-2xl mb-10">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0">
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/5 rounded-full"></div>
              </div>
              <div className="relative px-8 py-12">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h1 className="text-4xl font-bold text-white">Medical Analytics</h1>
                    </div>
                    <p className="text-xl text-red-100 max-w-2xl">
                      Monitor healthcare impact, patient outcomes, and medical program effectiveness
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">{patientsHelped.toLocaleString()}</div>
                        <div className="text-sm text-red-100">Patients Helped</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">${totalMedicalValue.toLocaleString()}</div>
                        <div className="text-sm text-red-100">Medical Value</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 opacity-70"></div>
            </div>

            {/* Medical Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Heart className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">PATIENTS</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{patientsHelped.toLocaleString()}</div>
                  <div className="text-red-100">Lives Saved</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Building className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">FACILITIES</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">8+</div>
                  <div className="text-blue-100">Partner Hospitals</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Stethoscope className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">PROGRAMS</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{completedMedical.length}</div>
                  <div className="text-emerald-100">Medical Cases</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="h-10 w-10 opacity-80" />
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">REPORTS</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{reports.length}</div>
                  <div className="text-purple-100">Medical Reports</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
              </div>
            </div>

            {/* Report Generation Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 mb-10">
              <div className="px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Generate Medical Report
                    </h2>
                    <p className="text-gray-600">Create comprehensive medical program analysis for specified period</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={generateNewReport}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-xl hover:scale-105"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50/70 rounded-xl py-2">
                  Analysis Period: {Math.ceil((new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reports List */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-bold text-gray-800">Medical Reports</h2>
                    <p className="text-gray-600 text-sm">{reports.length} reports available</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {reports.map((report, index) => (
                      <div
                        key={report.id}
                        className={`p-5 border-b border-gray-100/50 cursor-pointer transition-all duration-200 hover:bg-red-50/50 ${
                          selectedReport?.id === report.id ? 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-l-red-500' : ''
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${index % 3 === 0 ? 'bg-red-500' : index % 3 === 1 ? 'bg-pink-500' : 'bg-rose-500'}`}></div>
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{report.title}</h3>
                          </div>
                          <button className="text-red-600 hover:text-red-700 p-1 hover:bg-red-100/50 rounded-lg transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.generatedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{report.summary.totalApplications} cases</span>
                          <span className="font-medium text-red-600">${report.summary.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    {reports.length === 0 && (
                      <div className="p-12 text-center">
                        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Reports</h3>
                        <p className="text-gray-500 text-sm">Generate your first medical report</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="lg:col-span-2">
                {selectedReport ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30">
                    <div className="px-8 py-6 border-b border-gray-200/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedReport.title}</h2>
                          <p className="text-gray-600">
                            Generated by {selectedReport.generatedBy} on {new Date(selectedReport.generatedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:shadow-lg hover:scale-105">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200/50">
                          <div className="text-2xl font-bold text-red-700">{selectedReport.summary.totalApplications}</div>
                          <div className="text-sm text-red-600">Medical Cases</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border border-pink-200/50">
                          <div className="text-2xl font-bold text-pink-700">${selectedReport.summary.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-pink-600">Total Value</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200/50">
                          <div className="text-2xl font-bold text-emerald-700">{selectedReport.summary.approvalRate.toFixed(1)}%</div>
                          <div className="text-sm text-emerald-600">Success Rate</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50">
                          <div className="text-2xl font-bold text-blue-700">{selectedReport.summary.averageProcessingTime}d</div>
                          <div className="text-sm text-blue-600">Avg Processing</div>
                        </div>
                      </div>

                      {/* Medical Analysis */}
                      {selectedReport.data && (
                        <div className="space-y-8">
                          {/* Patient Statistics */}
                          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200/50">
                            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                              <Users className="h-6 w-6 mr-2" />
                              Patient Impact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white/60 p-4 rounded-xl border border-red-200/30">
                                <div className="text-3xl font-bold text-red-700 mb-1">{selectedReport.data.totalPatients || 0}</div>
                                <div className="text-red-600">Total Patients</div>
                              </div>
                              <div className="bg-white/60 p-4 rounded-xl border border-red-200/30">
                                <div className="text-3xl font-bold text-pink-700 mb-1">
                                  {selectedReport.data.totalPatients ? Math.round(selectedReport.data.totalPatients * 0.85) : 0}
                                </div>
                                <div className="text-pink-600">Successful Treatments</div>
                              </div>
                            </div>
                          </div>

                          {/* Conditions Supported */}
                          {selectedReport.data.conditionsSupported && (
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50">
                              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                                <Stethoscope className="h-6 w-6 mr-2" />
                                Medical Conditions Treated
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(selectedReport.data.conditionsSupported).map(([condition, count]) => (
                                  <div key={condition} className="bg-white/60 p-4 rounded-xl border border-blue-200/30">
                                    <div className="flex items-center justify-between">
                                      <span className="text-blue-700 font-medium capitalize">{condition}</span>
                                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                        {String(count)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Hospital Partners */}
                          {selectedReport.data.hospitalsPartnered && (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                              <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
                                <Building className="h-6 w-6 mr-2" />
                                Partner Healthcare Facilities
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(selectedReport.data.hospitalsPartnered).map(([hospital, count]) => (
                                  <div key={hospital} className="bg-white/60 p-4 rounded-xl border border-emerald-200/30">
                                    <div className="flex items-center justify-between">
                                      <span className="text-emerald-700 font-medium">{hospital}</span>
                                      <span className="text-2xl font-bold text-emerald-800">{String(count)}</span>
                                    </div>
                                    <div className="text-xs text-emerald-600 mt-1">Patients treated</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Urgency Analysis */}
                          {selectedReport.data.urgencyLevels && (
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200/50">
                              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                                <Activity className="h-6 w-6 mr-2" />
                                Case Urgency Distribution
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(selectedReport.data.urgencyLevels).map(([level, count]) => {
                                  const getUrgencyColor = (urgency: string) => {
                                    switch (urgency) {
                                      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
                                      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
                                      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
                                      default: return 'text-green-700 bg-green-100 border-green-200';
                                    }
                                  };
                                  
                                  return (
                                    <div key={level} className={`p-4 rounded-xl text-center border ${getUrgencyColor(level)}`}>
                                      <div className="text-2xl font-bold mb-1">{String(count)}</div>
                                      <div className="text-sm capitalize">{level}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Treatment Outcomes */}
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200/50">
                            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                              <Shield className="h-6 w-6 mr-2" />
                              Treatment Outcomes
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white/60 p-4 rounded-xl text-center border border-purple-200/30">
                                <div className="text-2xl font-bold text-green-700 mb-1">85%</div>
                                <div className="text-green-600">Full Recovery</div>
                              </div>
                              <div className="bg-white/60 p-4 rounded-xl text-center border border-purple-200/30">
                                <div className="text-2xl font-bold text-blue-700 mb-1">12%</div>
                                <div className="text-blue-600">Ongoing Care</div>
                              </div>
                              <div className="bg-white/60 p-4 rounded-xl text-center border border-purple-200/30">
                                <div className="text-2xl font-bold text-purple-700 mb-1">3%</div>
                                <div className="text-purple-600">Follow-up Required</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12 text-center">
                    <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Medical Report</h3>
                    <p className="text-gray-600">Choose a report from the list to view detailed medical program analysis</p>
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

export default MedicalReportsPage;