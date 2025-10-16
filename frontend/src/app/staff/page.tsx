'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings,
  FileText,
  Heart,
  ArrowRight,
  Lock,
  CheckCircle,
  Zap
} from 'lucide-react';

export default function StaffPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/bgf-logo.png" 
                alt="Bridging Gaps Foundation" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Bridging Gaps Foundation</h1>
                <p className="text-xs text-gray-500">Staff Portal</p>
              </div>
            </Link>
            
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Back to Public Site
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
              <Shield className="h-4 w-4 mr-2" />
              BGF Internal System
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Staff Portal
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Management Hub
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Comprehensive application management system for BGF staff, directors, and executives. 
              Access workflow tools, reports, and administrative functions.
            </p>

            <Link 
              href="/auth/login"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 inline-flex items-center space-x-3"
            >
              <Lock className="h-6 w-6" />
              <span>Access Staff System</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent mb-6">
              Powerful Management Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage applications, workflows, and organizational operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Application Management */}
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-200">
              <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Application Management</h3>
              <p className="text-blue-700 mb-6">
                Review, approve, and manage applications through comprehensive workflow systems.
              </p>
              <ul className="space-y-2 text-blue-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Review Applications</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Workflow Management</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Status Tracking</li>
              </ul>
            </div>

            {/* Analytics & Reports */}
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200">
              <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Analytics & Reports</h3>
              <p className="text-purple-700 mb-6">
                Comprehensive reporting tools with real-time analytics and insights.
              </p>
              <ul className="space-y-2 text-purple-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Financial Reports</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Impact Analytics</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />KPI Dashboards</li>
              </ul>
            </div>

            {/* User Management */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-200">
              <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-4">User Management</h3>
              <p className="text-green-700 mb-6">
                Manage staff accounts, roles, and permissions across the organization.
              </p>
              <ul className="space-y-2 text-green-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Role Management</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Access Control</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Team Organization</li>
              </ul>
            </div>

            {/* System Administration */}
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-orange-200">
              <div className="bg-orange-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-900 mb-4">System Settings</h3>
              <p className="text-orange-700 mb-6">
                Configure system parameters, workflows, and organizational settings.
              </p>
              <ul className="space-y-2 text-orange-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />System Configuration</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Workflow Setup</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Data Management</li>
              </ul>
            </div>

            {/* Security & Compliance */}
            <div className="group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-red-200">
              <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-4">Security & Audit</h3>
              <p className="text-red-700 mb-6">
                Security monitoring, audit trails, and compliance management tools.
              </p>
              <ul className="space-y-2 text-red-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Access Monitoring</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Audit Trails</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Compliance Tools</li>
              </ul>
            </div>

            {/* System Testing */}
            <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-indigo-200">
              <div className="bg-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-4">System Validation</h3>
              <p className="text-indigo-700 mb-6">
                Comprehensive testing tools to ensure system reliability and performance.
              </p>
              <ul className="space-y-2 text-indigo-600">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />System Tests</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Performance Monitoring</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Data Validation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Access Roles */}
      <section className="py-16 bg-gradient-to-r from-slate-100 to-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Role-Based Access</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Customized interfaces and permissions for different organizational roles
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { role: 'Staff', icon: Users, color: 'blue' },
              { role: 'Directors', icon: Shield, color: 'purple' },
              { role: 'Executives', icon: BarChart3, color: 'green' },
              { role: 'Founders', icon: Heart, color: 'red' }
            ].map((item, index) => (
              <div key={index} className={`text-center p-6 bg-${item.color}-50 rounded-xl border border-${item.color}-200`}>
                <div className={`bg-${item.color}-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`font-semibold text-${item.color}-900`}>{item.role}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              Ready to Access the System?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Login with your BGF staff credentials to access the complete management system
            </p>
            <Link 
              href="/auth/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 inline-flex items-center justify-center space-x-3"
            >
              <Lock className="h-6 w-6" />
              <span>Staff Login</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}