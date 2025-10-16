'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Heart, FileText, Mail, Phone, ArrowRight, Home } from 'lucide-react';

export default function ApplicationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applicationId, setApplicationId] = useState<string>('');

  useEffect(() => {
    const id = searchParams?.get('id');
    if (id) {
      setApplicationId(id);
    } else {
      // If no ID, redirect back to apply page
      router.push('/apply');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/bgf-logo.png" 
                alt="Bridging Gaps Foundation" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Bridging Gaps Foundation</h1>
                <p className="text-xs text-gray-500">Application Submitted</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-8">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
            <CheckCircle className="h-16 w-16 text-green-600 relative z-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for applying to Bridging Gaps Foundation. Your application has been successfully received and is now under review.
          </p>
        </div>

        {/* Application Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-4">
              <Heart className="h-4 w-4 mr-2" />
              Application Reference
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Reference Number</h2>
              <div className="text-3xl font-bold text-blue-600 font-mono tracking-wider">
                {applicationId}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Please save this reference number for your records
              </p>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Happens Next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Email Confirmation</h3>
                <p className="text-blue-700 text-sm">
                  You'll receive an email confirmation within 24 hours with your application details
                </p>
              </div>

              <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Review Process</h3>
                <p className="text-yellow-700 text-sm">
                  Our team will carefully review your application over the next 2-4 weeks
                </p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Decision Notification</h3>
                <p className="text-green-700 text-sm">
                  We'll contact you with our decision and next steps via email and phone
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Important Information
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Keep your reference number <strong>{applicationId}</strong> safe for future communication</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Check your email regularly, including spam/junk folders</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>You may be contacted for additional information or documents</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Application review typically takes 2-4 weeks</span>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need Help or Have Questions?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get assistance via email</p>
              <a 
                href="mailto:applications@bgfzim.org" 
                className="inline-flex items-center text-blue-600 font-medium hover:underline"
              >
                applications@bgfzim.org
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call for immediate assistance</p>
              <a 
                href="tel:+263000000000" 
                className="inline-flex items-center text-green-600 font-medium hover:underline"
              >
                +263 XX XXX XXXX
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4">
              Reference your application ID <strong>{applicationId}</strong> in all communications
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/apply/status"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center justify-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Check Application Status</span>
            </Link>
            
            <Link 
              href="/"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-105 inline-flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm">
            Thank you for choosing Bridging Gaps Foundation
          </p>
        </div>
      </div>
    </div>
  );
}