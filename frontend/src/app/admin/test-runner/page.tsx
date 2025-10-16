'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SystemTester, type TestResult } from '@/utils/systemTests';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { 
  CheckCircle2, 
  XCircle, 
  PlayCircle, 
  RefreshCcw, 
  BarChart3,
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';

const SystemTestRunnerPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  } | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setSummary(null);

    try {
      const tester = new SystemTester();
      await tester.runAllTests();
      const report = tester.getTestReport();
      
      setTestResults(report.details);
      setSummary(report.summary);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getStatusBadge = (passed: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        passed 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {passed ? 'PASS' : 'FAIL'}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-10">
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
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                      <h1 className="text-4xl font-bold text-white">System Test Runner</h1>
                    </div>
                    <p className="text-xl text-indigo-100 max-w-2xl">
                      Comprehensive validation of BGF Aid Management System functionality
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    {summary && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                        <div className="text-4xl font-bold text-white mb-2">{summary.passRate}%</div>
                        <div className="text-sm text-indigo-100">Pass Rate</div>
                        <div className="text-xs text-indigo-200 mt-1">
                          {summary.passed}/{summary.total} tests passed
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-70"></div>
            </div>

            {/* Test Controls */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 mb-10">
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                      Test Suite Controls
                    </h2>
                    <p className="text-gray-600">
                      Run comprehensive tests to validate system functionality, workflows, and data integrity
                    </p>
                  </div>
                  <div className="space-x-4">
                    <Button
                      onClick={runTests}
                      disabled={isRunning}
                      isLoading={isRunning}
                      loadingText="Running Tests..."
                      leftIcon={<PlayCircle className="h-5 w-5" />}
                      variant="primary"
                      size="lg"
                    >
                      Run All Tests
                    </Button>
                    {testResults.length > 0 && (
                      <Button
                        onClick={() => {
                          setTestResults([]);
                          setSummary(null);
                        }}
                        leftIcon={<RefreshCcw className="h-5 w-5" />}
                        variant="secondary"
                        size="lg"
                      >
                        Clear Results
                      </Button>
                    )}
                  </div>
                </div>

                {isRunning && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-center space-x-4">
                      <LoadingSpinner variant="primary" />
                      <div className="text-blue-800">
                        <p className="font-medium">Running system validation tests...</p>
                        <p className="text-sm text-blue-600">This may take a few moments</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Test Results Summary */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="h-10 w-10 opacity-80" />
                      <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">TOTAL</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{summary.total}</div>
                    <div className="text-blue-100">Tests Run</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <CheckCircle2 className="h-10 w-10 opacity-80" />
                      <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">PASSED</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{summary.passed}</div>
                    <div className="text-green-100">Successful</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <XCircle className="h-10 w-10 opacity-80" />
                      <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">FAILED</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{summary.failed}</div>
                    <div className="text-red-100">Failed</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="relative p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="h-10 w-10 opacity-80" />
                      <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">SCORE</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{summary.passRate}%</div>
                    <div className="text-purple-100">Pass Rate</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Test Results Details */}
            {testResults.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30">
                <div className="px-8 py-6 border-b border-gray-200/50">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Test Results
                  </h2>
                  <p className="text-gray-600">Detailed results for each test case</p>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {testResults.map((result, index) => (
                      <div 
                        key={index}
                        className={`p-6 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                          result.passed 
                            ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                            : 'bg-red-50 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(result.passed)}
                            <h3 className="text-lg font-semibold text-gray-900">
                              {result.testName}
                            </h3>
                            {getStatusBadge(result.passed)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Test #{index + 1}
                          </div>
                        </div>

                        <p className={`mb-4 ${
                          result.passed ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.message}
                        </p>

                        {result.data && (
                          <div className="bg-white/60 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Test Data:</h4>
                            <pre className="text-xs text-gray-600 overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            {testResults.length === 0 && !isRunning && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="p-4 bg-blue-100 rounded-full inline-block mb-6">
                    <AlertTriangle className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Test</h3>
                  <p className="text-gray-600 mb-8">
                    Click "Run All Tests" to validate the BGF Aid Management System. The test suite will check:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Database Functions</h4>
                      <p className="text-sm text-blue-700">Application submission, data persistence, and retrieval</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-900 mb-2">Workflow Management</h4>
                      <p className="text-sm text-green-700">Status transitions, role permissions, and approvals</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h4 className="font-semibold text-purple-900 mb-2">Report Generation</h4>
                      <p className="text-sm text-purple-700">Financial, impact, disbursement, and medical reports</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <h4 className="font-semibold text-orange-900 mb-2">KPI Calculations</h4>
                      <p className="text-sm text-orange-700">Statistics, metrics, and performance indicators</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SystemTestRunnerPage;