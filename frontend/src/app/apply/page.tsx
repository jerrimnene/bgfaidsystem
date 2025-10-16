'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  GraduationCap, 
  Users, 
  Stethoscope, 
  ArrowRight,
  FileText,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

export default function PublicApplyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Public Header */}
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
                <p className="text-xs text-gray-500">Application Portal</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/apply/status" className="text-gray-600 hover:text-blue-600 font-medium">
                Check Status
              </Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Application Hero */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Public Application Portal
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Apply for
            <span className="block bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              Life-Changing Support
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Submit your application for BGF aid programs. Our streamlined process 
            ensures every application receives careful consideration.
          </p>
        </div>
      </section>

      {/* Application Options */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Small Grants */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <Image
                  src="/images/communities-faith.jpg"
                  alt="Community Projects"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-blue-600">
                    Up to $50,000
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Small Grants</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Fund community projects, small businesses, and initiatives that create lasting positive impact in your community.
                </p>
                <ul className="text-sm text-gray-600 mb-8 space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Community development projects</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Small business initiatives</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Infrastructure improvements</li>
                </ul>
                <Link 
                  href="/apply/small-grants"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Apply for Small Grant</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Education Support */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <Image
                  src="/images/education-mission.jpg"
                  alt="Education Support"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                    Full Scholarship
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Education Support</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  High school and university scholarships for students who demonstrate academic promise and financial need.
                </p>
                <ul className="text-sm text-gray-600 mb-8 space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />High school scholarships</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />University degree funding</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Academic mentorship</li>
                </ul>
                <Link 
                  href="/apply/education"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Apply for Scholarship</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Medical Assistance */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <Image
                  src="/images/medical-clinic.jpg"
                  alt="Medical Assistance"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-red-600">
                    Free Services
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <Stethoscope className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Medical Assistance</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Free medical services through our partner hospitals for those who cannot afford essential healthcare.
                </p>
                <ul className="text-sm text-gray-600 mb-8 space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Emergency medical care</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Surgical procedures</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Medication support</li>
                </ul>
                <Link 
                  href="/apply/medical"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Apply for Medical Aid</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* General Support */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <Image
                  src="/images/agriculture-mechanisation.jpg"
                  alt="General Support"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-orange-600">
                    Various Programs
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-orange-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">General Support</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Other forms of assistance including agricultural support, emergency aid, and special programs.
                </p>
                <ul className="text-sm text-gray-600 mb-8 space-y-2">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Agricultural assistance</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Emergency support</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Special programs</li>
                </ul>
                <Link 
                  href="/apply/general"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Apply for Support</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Application Process</h2>
            <p className="text-lg text-gray-600">
              Our streamlined process makes it easy to apply for the support you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Program',
                description: 'Select the type of support you need from our available programs',
                icon: FileText
              },
              {
                step: '2', 
                title: 'Complete Application',
                description: 'Fill out the application form with required information and documents',
                icon: FileText
              },
              {
                step: '3',
                title: 'Review Process',
                description: 'Our team carefully reviews your application and may request additional information',
                icon: Clock
              },
              {
                step: '4',
                title: 'Receive Decision',
                description: 'Get notified of the decision and next steps for approved applications',
                icon: CheckCircle
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <div className="mb-3">
                  <item.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our support team is here to assist you throughout the application process
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Email Support</h3>
              <p className="text-blue-700 text-sm mb-3">Get help via email</p>
              <a href="mailto:applications@bgfzim.org" className="text-blue-600 font-medium hover:underline">
                applications@bgfzim.org
              </a>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Phone Support</h3>
              <p className="text-green-700 text-sm mb-3">Call us for immediate help</p>
              <a href="tel:+263000000000" className="text-green-600 font-medium hover:underline">
                +263 XX XXX XXXX
              </a>
            </div>
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Check Status</h3>
              <p className="text-purple-700 text-sm mb-3">Track your application</p>
              <Link href="/apply/status" className="text-purple-600 font-medium hover:underline">
                Check Application Status
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
