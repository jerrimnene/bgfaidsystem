'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Upload, FileText, CheckCircle, Send } from 'lucide-react';
import { apiService } from '@/utils/apiService';
import { toast } from 'react-hot-toast';

export default function PublicSmallGrantsApplication() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    projectTitle: '',
    fundingRequestAmount: '',
    numberOfBeneficiaries: '',
    projectGoals: '',
    challengeDescription: '',
    solutionSummary: '',
    resourcesRequired: '',
    timeline: ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const applicationData = {
        ...formData,
        applicationType: 'small_grants' as const,
        fundingRequestAmount: parseFloat(formData.fundingRequestAmount) || 0,
        numberOfBeneficiaries: parseInt(formData.numberOfBeneficiaries) || 0
      };

      const response = await apiService.submitApplication(applicationData, files);
      
      if (response.success && response.data) {
        const applicationId = response.data.id;
        
        toast.success(
          `Application submitted successfully! Your reference number is ${applicationId}. You will receive an email confirmation shortly.`,
          { duration: 6000 }
        );

        // Redirect to success page
        router.push(`/apply/success?id=${applicationId}`);
      } else {
        throw new Error(response.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
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
                <h1 className="font-bold text-gray-900">Small Grants Application</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-4">
            <Heart className="h-4 w-4 mr-2" />
            Small Grants Program
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Funding Application</h1>
          <p className="text-lg text-gray-600">
            Apply for up to $50,000 to support your community development project
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Applicant Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Applicant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="applicantName"
                  required
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+263 XX XXX XXXX"
                />
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  required
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Give your project a clear, descriptive title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Amount Requested (USD) *
                  </label>
                  <input
                    type="number"
                    name="fundingRequestAmount"
                    required
                    min="1"
                    max="50000"
                    value={formData.fundingRequestAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum: $50,000</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Beneficiaries *
                  </label>
                  <input
                    type="number"
                    name="numberOfBeneficiaries"
                    required
                    min="1"
                    value={formData.numberOfBeneficiaries}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">How many people will benefit?</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Goals *
                </label>
                <textarea
                  name="projectGoals"
                  required
                  rows={4}
                  value={formData.projectGoals}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Describe what you hope to achieve with this project..."
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge/Need *
                </label>
                <textarea
                  name="challengeDescription"
                  required
                  rows={4}
                  value={formData.challengeDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Describe the problem or challenge your project addresses..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Solution *
                </label>
                <textarea
                  name="solutionSummary"
                  required
                  rows={4}
                  value={formData.solutionSummary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Explain how your project will solve the problem..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resources Required *
                </label>
                <textarea
                  name="resourcesRequired"
                  required
                  rows={4}
                  value={formData.resourcesRequired}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="List the resources, materials, and equipment needed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Timeline *
                </label>
                <textarea
                  name="timeline"
                  required
                  rows={3}
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Provide a timeline with key milestones..."
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Supporting Documents</h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-blue-800 mb-2">Required Documents:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Project proposal document</li>
                <li>• Detailed budget breakdown</li>
                <li>• Applicant identification</li>
                <li>• Community support letters (if applicable)</li>
              </ul>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <label className="cursor-pointer">
                <span className="text-lg font-medium text-gray-700">Choose files to upload</span>
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 5MB each)</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-gray-900">Selected Files:</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                    <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Declaration */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>By submitting this application, I declare that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All information provided is true, correct and complete</li>
                <li>I understand that false information may result in application rejection</li>
                <li>I agree to provide additional information if requested</li>
                <li>I understand that submission does not guarantee approval</li>
              </ul>
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="declaration"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="declaration" className="ml-2 text-sm text-gray-900">
                I agree to the above declaration *
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-xl'
                }
                text-white
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-12 text-center bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 text-sm mb-4">
            Contact our support team if you need assistance with your application
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="mailto:applications@bgfzim.org" className="text-blue-600 font-medium hover:underline">
              applications@bgfzim.org
            </a>
            <a href="tel:+263000000000" className="text-blue-600 font-medium hover:underline">
              +263 XX XXX XXXX
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}