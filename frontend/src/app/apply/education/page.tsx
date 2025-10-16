'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Upload,
  Loader2,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { applicationsApi } from '@/utils/api';

export default function EducationApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    idNumber: '',
    address: '',
    aidType: 'education',
    description: '',
    amountRequested: '',
    urgency: 'medium',
    supportingDocuments: [],
    
    // Education specific fields
    currentEducationLevel: '',
    schoolName: '',
    desiredLevel: '',
    academicRecords: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    financialSituation: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert amount to number
      const applicationData = {
        ...formData,
        amountRequested: parseInt(formData.amountRequested) || 0
      };

      console.log('Submitting application:', applicationData);
      
      const response = await applicationsApi.createPublicApplication(applicationData);
      
      if (response.success) {
        toast.success('Application submitted successfully!');
        router.push('/apply/success');
      } else {
        throw new Error(response.error || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <p className="text-xs text-gray-500">Education Support Application</p>
              </div>
            </Link>
            
            <Link href="/apply" className="flex items-center text-gray-600 hover:text-blue-600 font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Form Header */}
        <div className="text-center mb-12">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Education Support Application</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Apply for our education support program. Please fill out all required fields accurately.
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Personal Information Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="form-label">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="form-input"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="form-label">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="form-input"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="form-label">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="form-label">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+263..."
                />
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="form-label">Date of Birth *</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="idNumber" className="form-label">ID Number *</label>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  required
                  className="form-input"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="address" className="form-label">Full Address *</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Guardian Information Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              Guardian Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="guardianName" className="form-label">Guardian Full Name *</label>
                <input
                  id="guardianName"
                  name="guardianName"
                  type="text"
                  required
                  className="form-input"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="guardianPhone" className="form-label">Guardian Phone Number *</label>
                <input
                  id="guardianPhone"
                  name="guardianPhone"
                  type="tel"
                  required
                  className="form-input"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="guardianEmail" className="form-label">Guardian Email Address</label>
                <input
                  id="guardianEmail"
                  name="guardianEmail"
                  type="email"
                  className="form-input"
                  value={formData.guardianEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Education Information Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <span className="text-green-600 font-bold">3</span>
              </div>
              Education Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="currentEducationLevel" className="form-label">Current Education Level *</label>
                <select
                  id="currentEducationLevel"
                  name="currentEducationLevel"
                  required
                  className="form-input"
                  value={formData.currentEducationLevel}
                  onChange={handleInputChange}
                >
                  <option value="">Select level</option>
                  <option value="grade_7">Grade 7 (Primary Complete)</option>
                  <option value="form_1">Form 1</option>
                  <option value="form_2">Form 2</option>
                  <option value="form_3">Form 3</option>
                  <option value="form_4">Form 4</option>
                  <option value="form_6">Form 6</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="desiredLevel" className="form-label">Desired Education Level *</label>
                <select
                  id="desiredLevel"
                  name="desiredLevel"
                  required
                  className="form-input"
                  value={formData.desiredLevel}
                  onChange={handleInputChange}
                >
                  <option value="">Select level</option>
                  <option value="form_1">Form 1</option>
                  <option value="form_2">Form 2</option>
                  <option value="form_3">Form 3</option>
                  <option value="form_4">Form 4</option>
                  <option value="form_6">Form 6</option>
                  <option value="university">University</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="schoolName" className="form-label">Current/Last School Name *</label>
                <input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  required
                  className="form-input"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="academicRecords" className="form-label">Academic Performance Summary *</label>
                <textarea
                  id="academicRecords"
                  name="academicRecords"
                  rows={3}
                  required
                  className="form-input"
                  placeholder="Please describe your academic performance, grades, and achievements"
                  value={formData.academicRecords}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              Financial Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="amountRequested" className="form-label">Scholarship Amount Requested (USD) *</label>
                <input
                  id="amountRequested"
                  name="amountRequested"
                  type="number"
                  min="100"
                  max="10000"
                  required
                  className="form-input"
                  value={formData.amountRequested}
                  onChange={handleInputChange}
                  placeholder="e.g., 2000"
                />
              </div>
              
              <div>
                <label htmlFor="financialSituation" className="form-label">Family Financial Situation *</label>
                <textarea
                  id="financialSituation"
                  name="financialSituation"
                  rows={4}
                  required
                  className="form-input"
                  placeholder="Please describe your family's financial situation and why you need this scholarship"
                  value={formData.financialSituation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Application Details Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <span className="text-red-600 font-bold">5</span>
              </div>
              Additional Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="urgency" className="form-label">Application Priority *</label>
                <select
                  id="urgency"
                  name="urgency"
                  required
                  className="form-input"
                  value={formData.urgency}
                  onChange={handleInputChange}
                >
                  <option value="low">Low - Can wait for next intake</option>
                  <option value="medium">Medium - Preferred for current term</option>
                  <option value="high">High - Urgent (explain in description)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="description" className="form-label">Personal Statement *</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  className="form-input"
                  placeholder="Tell us about yourself, your educational goals, and how this scholarship will help you achieve them"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t">
            <Link 
              href="/apply"
              className="text-gray-600 hover:text-blue-600 font-medium flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-4 text-lg font-semibold flex items-center space-x-2 min-w-[200px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}