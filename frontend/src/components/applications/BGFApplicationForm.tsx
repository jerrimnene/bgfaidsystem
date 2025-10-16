'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  GraduationCap, 
  DollarSign, 
  Heart,
  Save,
  Send,
  User,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

type ApplicationType = 'small_grants' | 'high_school_scholarship' | 'excellence_scholarship' | 'medical_assistance';

interface ApplicationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationalId: string;
  address: string;
  city: string;
  province: string;
  
  // Application Details
  applicationType: ApplicationType;
  title: string;
  description: string;
  amountRequested: number;
  purpose: string;
  
  // Category-specific fields
  schoolName?: string;
  gradeLevel?: string;
  academicYear?: string;
  degreeProgram?: string;
  university?: string;
  medicalCondition?: string;
  hospitalPreference?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  
  // Supporting Information
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
}

interface BGFApplicationFormProps {
  onSubmit: (data: ApplicationFormData, files: File[]) => void;
  onCancel: () => void;
  initialData?: Partial<ApplicationFormData>;
  isEditing?: boolean;
}

const BGFApplicationForm: React.FC<BGFApplicationFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isEditing = false
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationalId: '',
    address: '',
    city: '',
    province: '',
    applicationType: 'small_grants',
    title: '',
    description: '',
    amountRequested: 0,
    purpose: '',
    bankAccountName: '',
    bankName: '',
    accountNumber: '',
    branchCode: '',
    ...initialData
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const applicationTypes = [
    {
      id: 'small_grants' as ApplicationType,
      name: 'Small Grants',
      description: 'Community projects and small business initiatives',
      icon: DollarSign,
      maxAmount: 50000
    },
    {
      id: 'high_school_scholarship' as ApplicationType,
      name: 'High School Scholarship',
      description: 'Support for secondary education',
      icon: GraduationCap,
      maxAmount: 15000
    },
    {
      id: 'excellence_scholarship' as ApplicationType,
      name: 'Excellence Scholarship',
      description: 'Masters and degree program support',
      icon: GraduationCap,
      maxAmount: 100000
    },
    {
      id: 'medical_assistance' as ApplicationType,
      name: 'Medical Assistance',
      description: 'Free medical services through Arundel Hospital',
      icon: Heart,
      maxAmount: 0 // No monetary limit for medical
    }
  ];

  const handleInputChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      // Validate file types and sizes
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      return allowedTypes.includes(file.type) && file.size <= maxSize;
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, uploadedFiles);
  };

  const selectedType = applicationTypes.find(type => type.id === formData.applicationType);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold mb-2">
            Bridging Gap Foundation - {isEditing ? 'Edit Application' : 'New Application'}
          </h2>
          <p className="text-blue-100">
            {isEditing 
              ? 'Update your application details below' 
              : 'Complete all sections to submit your application'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Application Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Application Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicationTypes.map((type) => (
                <div
                  key={type.id}
                  className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                    formData.applicationType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('applicationType', type.id)}
                >
                  <div className="flex items-start space-x-3">
                    <type.icon className={`h-6 w-6 mt-1 ${
                      formData.applicationType === type.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-500">{type.description}</p>
                      {type.maxAmount > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Max: ${type.maxAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="applicationType"
                    value={type.id}
                    checked={formData.applicationType === type.id}
                    onChange={() => {}}
                    className="sr-only"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
                <input
                  type="text"
                  required
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange('nationalId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Street address, house number"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                <select
                  required
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Province</option>
                  <option value="harare">Harare</option>
                  <option value="bulawayo">Bulawayo</option>
                  <option value="manicaland">Manicaland</option>
                  <option value="mashonaland-central">Mashonaland Central</option>
                  <option value="mashonaland-east">Mashonaland East</option>
                  <option value="mashonaland-west">Mashonaland West</option>
                  <option value="masvingo">Masvingo</option>
                  <option value="matabeleland-north">Matabeleland North</option>
                  <option value="matabeleland-south">Matabeleland South</option>
                  <option value="midlands">Midlands</option>
                </select>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Application Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief title describing your application"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide a detailed description of your need or project"
              />
            </div>
            
            {formData.applicationType !== 'medical_assistance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Requested (USD) *
                  {selectedType && selectedType.maxAmount > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Max: ${selectedType.maxAmount.toLocaleString()})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={selectedType?.maxAmount || undefined}
                  value={formData.amountRequested}
                  onChange={(e) => handleInputChange('amountRequested', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose/Justification *</label>
              <textarea
                required
                rows={3}
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain how this assistance will help you or your community"
              />
            </div>
          </div>

          {/* Category-specific fields */}
          {(formData.applicationType === 'high_school_scholarship' || formData.applicationType === 'excellence_scholarship') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                Education Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.applicationType === 'high_school_scholarship' ? 'School Name' : 'University/Institution'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.applicationType === 'high_school_scholarship' ? formData.schoolName : formData.university}
                    onChange={(e) => handleInputChange(
                      formData.applicationType === 'high_school_scholarship' ? 'schoolName' : 'university',
                      e.target.value
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.applicationType === 'high_school_scholarship' ? 'Grade Level' : 'Degree Program'} *
                  </label>
                  {formData.applicationType === 'high_school_scholarship' ? (
                    <select
                      required
                      value={formData.gradeLevel}
                      onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Grade</option>
                      <option value="form1">Form 1</option>
                      <option value="form2">Form 2</option>
                      <option value="form3">Form 3</option>
                      <option value="form4">Form 4</option>
                      <option value="form5">Form 5</option>
                      <option value="form6">Form 6</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.degreeProgram}
                      onChange={(e) => handleInputChange('degreeProgram', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Bachelor of Science, Master of Arts"
                    />
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) => handleInputChange('academicYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2024/2025"
                />
              </div>
            </div>
          )}

          {formData.applicationType === 'medical_assistance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-blue-600" />
                Medical Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.medicalCondition}
                  onChange={(e) => handleInputChange('medicalCondition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your medical condition and required treatment"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Preference</label>
                  <select
                    value={formData.hospitalPreference}
                    onChange={(e) => handleInputChange('hospitalPreference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Hospital</option>
                    <option value="arundel">Arundel Hospital (Primary)</option>
                    <option value="parirenyatwa">Parirenyatwa Hospital</option>
                    <option value="sally_mugabe">Sally Mugabe Hospital</option>
                    <option value="other">Other (specify in comments)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level *</label>
                  <select
                    required
                    value={formData.urgencyLevel}
                    onChange={(e) => handleInputChange('urgencyLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Urgency</option>
                    <option value="low">Low - Routine care</option>
                    <option value="medium">Medium - Within 1 month</option>
                    <option value="high">High - Within 1 week</option>
                    <option value="critical">Critical - Immediate</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Banking Information */}
          {formData.applicationType !== 'medical_assistance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Banking Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccountName}
                    onChange={(e) => handleInputChange('bankAccountName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                  <select
                    required
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Bank</option>
                    <option value="cabs">CABS</option>
                    <option value="cbz">CBZ Bank</option>
                    <option value="ecocash">EcoCash</option>
                    <option value="fbc">FBC Bank</option>
                    <option value="nedbank">Nedbank</option>
                    <option value="stanbic">Stanbic Bank</option>
                    <option value="standard_chartered">Standard Chartered</option>
                    <option value="steward">Steward Bank</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
                  <input
                    type="text"
                    value={formData.branchCode}
                    onChange={(e) => handleInputChange('branchCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Document Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600" />
              Supporting Documents
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Required Documents:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• National ID copy</li>
                <li>• Proof of address (utility bill, bank statement)</li>
                {formData.applicationType === 'high_school_scholarship' && (
                  <>
                    <li>• School acceptance letter</li>
                    <li>• Academic transcripts</li>
                  </>
                )}
                {formData.applicationType === 'excellence_scholarship' && (
                  <>
                    <li>• University acceptance letter</li>
                    <li>• Academic transcripts</li>
                    <li>• Degree certificates (if applicable)</li>
                  </>
                )}
                {formData.applicationType === 'medical_assistance' && (
                  <>
                    <li>• Medical reports and diagnosis</li>
                    <li>• Doctor's recommendations</li>
                  </>
                )}
                {formData.applicationType === 'small_grants' && (
                  <>
                    <li>• Project proposal</li>
                    <li>• Budget breakdown</li>
                  </>
                )}
              </ul>
            </div>
            
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Upload files
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </label>
                  <span className="text-gray-500"> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF, DOC up to 5MB each
                </p>
              </div>
            </div>
            
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </button>
            
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Submit Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BGFApplicationForm;