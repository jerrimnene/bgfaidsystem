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
  Calendar,
  School,
  Building,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

type ApplicationType = 'small_grants' | 'high_school_scholarship' | 'excellence_scholarship' | 'medical_assistance';

interface SmallGrantFormData {
  // Application Summary
  applicantName: string;
  phone: string;
  email: string;
  projectTitle: string;
  submissionDate: string;
  projectGoals: string;
  fundingRequestAmount: number;
  numberOfBeneficiaries: number;
  
  // Challenge/Need
  challengeDescription: string;
  
  // Solution Summary
  solutionSummary: string;
  
  // Resources Required
  resourcesRequired: string;
  
  // Timeline
  timeline: string;
  
  // Supporting Documents
  supportingDocuments: string[];
}

interface HighSchoolScholarshipFormData {
  // Applicant Details
  surname: string;
  fullName: string;
  sex: 'Male' | 'Female' | '';
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  nationalId: string;
  physicalAddress: string;
  city: string;
  province: string;
  country: string;
  telephone: string;
  email: string;
  religion: string;
  denomination: string;
  
  // Guardian Details
  guardianName: string;
  relationship: 'Mother' | 'Father' | 'Other' | '';
  guardianAddress: string;
  guardianPhone: string;
  guardianEmail: string;
  
  // School Details
  schoolName: string;
  schoolAddress: string;
  schoolCity: string;
  schoolProvince: string;
  schoolPhone: string;
  schoolEmail: string;
  principalName: string;
  principalContact: string;
  yearOfEnrollment: string;
  currentGrade: string;
  otherScholarships: string;
  totalSchoolFees: number;
  
  // Motivation Letter
  motivationLetter: string;
}

interface EnhancedBGFApplicationFormProps {
  onSubmit: (data: any, files: File[]) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const EnhancedBGFApplicationForm: React.FC<EnhancedBGFApplicationFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isEditing = false
}) => {
  const [applicationType, setApplicationType] = useState<ApplicationType>('small_grants');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [smallGrantData, setSmallGrantData] = useState<SmallGrantFormData>({
    applicantName: '',
    phone: '',
    email: '',
    projectTitle: '',
    submissionDate: new Date().toISOString().split('T')[0],
    projectGoals: '',
    fundingRequestAmount: 0,
    numberOfBeneficiaries: 0,
    challengeDescription: '',
    solutionSummary: '',
    resourcesRequired: '',
    timeline: '',
    supportingDocuments: []
  });

  const [highSchoolData, setHighSchoolData] = useState<HighSchoolScholarshipFormData>({
    surname: '',
    fullName: '',
    sex: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: 'Zimbabwean',
    nationalId: '',
    physicalAddress: '',
    city: '',
    province: '',
    country: 'Zimbabwe',
    telephone: '',
    email: '',
    religion: '',
    denomination: '',
    guardianName: '',
    relationship: '',
    guardianAddress: '',
    guardianPhone: '',
    guardianEmail: '',
    schoolName: '',
    schoolAddress: '',
    schoolCity: '',
    schoolProvince: '',
    schoolPhone: '',
    schoolEmail: '',
    principalName: '',
    principalContact: '',
    yearOfEnrollment: '',
    currentGrade: '',
    otherScholarships: '',
    totalSchoolFees: 0,
    motivationLetter: ''
  });

  const applicationTypes = [
    {
      id: 'small_grants' as ApplicationType,
      name: 'Small Grants',
      description: 'Community projects and business initiatives (Max: $50,000)',
      icon: DollarSign,
      color: 'bg-blue-600'
    },
    {
      id: 'high_school_scholarship' as ApplicationType,
      name: 'High School Scholarship',
      description: 'BTG High School Scholarship of Excellence',
      icon: GraduationCap,
      color: 'bg-green-600'
    },
    {
      id: 'excellence_scholarship' as ApplicationType,
      name: 'Excellence Scholarship',
      description: 'University and Masters degree programs',
      icon: GraduationCap,
      color: 'bg-purple-600'
    },
    {
      id: 'medical_assistance' as ApplicationType,
      name: 'Medical Assistance',
      description: 'Free medical services through Arundel Hospital',
      icon: Heart,
      color: 'bg-red-600'
    }
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
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
    
    const formData = applicationType === 'small_grants' ? smallGrantData : highSchoolData;
    onSubmit({ applicationType, ...formData }, uploadedFiles);
  };

  const renderSmallGrantForm = () => (
    <div className="space-y-8">
      {/* Application Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Application Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name of Applicant *</label>
            <input
              type="text"
              required
              value={smallGrantData.applicantName}
              onChange={(e) => setSmallGrantData(prev => ({ ...prev, applicantName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              required
              value={smallGrantData.phone}
              onChange={(e) => setSmallGrantData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={smallGrantData.email}
              onChange={(e) => setSmallGrantData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={smallGrantData.projectTitle}
              onChange={(e) => setSmallGrantData(prev => ({ ...prev, projectTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Request Amount (USD) *</label>
            <input
              type="number"
              required
              min="0"
              max="50000"
              value={smallGrantData.fundingRequestAmount}
              onChange={(e) => setSmallGrantData(prev => ({ ...prev, fundingRequestAmount: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Beneficiaries *</label>
            <input
              type="number"
              required
              min="1"
              value={smallGrantData.numberOfBeneficiaries}
              onChange={(e) => setSmallGrantData(prev => ({ ...prev, numberOfBeneficiaries: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Goals *</label>
          <textarea
            required
            rows={3}
            value={smallGrantData.projectGoals}
            onChange={(e) => setSmallGrantData(prev => ({ ...prev, projectGoals: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your project goals and objectives..."
          />
        </div>
      </div>

      {/* Challenge/Need */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Challenge/Need</h3>
        <p className="text-sm text-gray-600 mb-3">Describe as completely as possible the challenge or need you are looking to solve. How big is the problem? Why is it a problem?</p>
        <textarea
          required
          rows={8}
          value={smallGrantData.challengeDescription}
          onChange={(e) => setSmallGrantData(prev => ({ ...prev, challengeDescription: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the challenge or need your project addresses..."
        />
      </div>

      {/* Solution Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Solution Summary</h3>
        <p className="text-sm text-gray-600 mb-3">Explain the solution and how you think it could solve the problem.</p>
        <textarea
          required
          rows={8}
          value={smallGrantData.solutionSummary}
          onChange={(e) => setSmallGrantData(prev => ({ ...prev, solutionSummary: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Explain your proposed solution..."
        />
      </div>

      {/* Resources Required */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Resources Required</h3>
        <p className="text-sm text-gray-600 mb-3">Please list all resources and associated funding required to successfully test this solution.</p>
        <textarea
          required
          rows={8}
          value={smallGrantData.resourcesRequired}
          onChange={(e) => setSmallGrantData(prev => ({ ...prev, resourcesRequired: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="List resources, equipment, materials, and funding breakdown..."
        />
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Timeline</h3>
        <p className="text-sm text-gray-600 mb-3">Please provide a timeline for project implementation.</p>
        <textarea
          required
          rows={6}
          value={smallGrantData.timeline}
          onChange={(e) => setSmallGrantData(prev => ({ ...prev, timeline: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Provide project timeline with key milestones and phases..."
        />
      </div>
    </div>
  );

  const renderHighSchoolForm = () => (
    <div className="space-y-8">
      {/* General Information */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">BTG High School Scholarship of Excellence</h3>
        <p className="text-sm text-blue-700">
          Available only to Zimbabwean Citizens. Intended to assist students whose parents/guardians are in financial need and unable to finance secondary education in any Zimbabwean registered public or mission secondary school.
        </p>
      </div>

      {/* Applicant Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Details of Applicant
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Surname of Applicant *</label>
            <input
              type="text"
              required
              value={highSchoolData.surname}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, surname: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name(s) *</label>
            <input
              type="text"
              required
              value={highSchoolData.fullName}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
            <select
              required
              value={highSchoolData.sex}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, sex: e.target.value as 'Male' | 'Female' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input
              type="date"
              required
              value={highSchoolData.dateOfBirth}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth *</label>
            <input
              type="text"
              required
              value={highSchoolData.placeOfBirth}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, placeOfBirth: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">National ID Number *</label>
            <input
              type="text"
              required
              value={highSchoolData.nationalId}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, nationalId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 12-345678-Z-90"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Physical Home Address *</label>
          <input
            type="text"
            required
            value={highSchoolData.physicalAddress}
            onChange={(e) => setHighSchoolData(prev => ({ ...prev, physicalAddress: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              required
              value={highSchoolData.city}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
            <input
              type="text"
              required
              value={highSchoolData.province}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, province: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <input
              type="text"
              required
              value={highSchoolData.country}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone Number *</label>
            <input
              type="tel"
              required
              value={highSchoolData.telephone}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, telephone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={highSchoolData.email}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Guardian Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name & Surname of Guardian *</label>
            <input
              type="text"
              required
              value={highSchoolData.guardianName}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, guardianName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship with Applicant *</label>
            <select
              required
              value={highSchoolData.relationship}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, relationship: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Other">Other Guardian</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Guardian's Physical Address *</label>
          <input
            type="text"
            required
            value={highSchoolData.guardianAddress}
            onChange={(e) => setHighSchoolData(prev => ({ ...prev, guardianAddress: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian's Phone Number *</label>
            <input
              type="tel"
              required
              value={highSchoolData.guardianPhone}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, guardianPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian's Email Address</label>
            <input
              type="email"
              value={highSchoolData.guardianEmail}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, guardianEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* School Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <School className="h-5 w-5 mr-2 text-blue-600" />
          Details of High School
        </h3>
        <p className="text-sm text-gray-600 mb-4">Applicants must be enrolled in a registered public or mission school in Zimbabwe.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name of School *</label>
            <input
              type="text"
              required
              value={highSchoolData.schoolName}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, schoolName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Grade/Form *</label>
            <select
              required
              value={highSchoolData.currentGrade}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, currentGrade: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Grade/Form</option>
              <option value="Form 1">Form 1</option>
              <option value="Form 2">Form 2</option>
              <option value="Form 3">Form 3</option>
              <option value="Form 4">Form 4</option>
              <option value="Form 5">Form 5</option>
              <option value="Form 6">Form 6</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">School Physical Address *</label>
          <input
            type="text"
            required
            value={highSchoolData.schoolAddress}
            onChange={(e) => setHighSchoolData(prev => ({ ...prev, schoolAddress: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total School Fees per Term (USD) *</label>
            <input
              type="number"
              required
              min="0"
              value={highSchoolData.totalSchoolFees}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, totalSchoolFees: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Include boarding, tuition, and levies"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Enrollment *</label>
            <input
              type="text"
              required
              value={highSchoolData.yearOfEnrollment}
              onChange={(e) => setHighSchoolData(prev => ({ ...prev, yearOfEnrollment: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2024"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Other Scholarships, Awards, Bursaries</label>
          <textarea
            rows={3}
            value={highSchoolData.otherScholarships}
            onChange={(e) => setHighSchoolData(prev => ({ ...prev, otherScholarships: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please provide details and amounts of other financial assistance received..."
          />
        </div>
      </div>

      {/* Motivation Letter */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivation Letter (Maximum 250 words)</h3>
        <p className="text-sm text-gray-600 mb-3">Include information about your financial situation and how the BTG High School scholarship would benefit your studies and career aspirations.</p>
        <textarea
          required
          rows={8}
          maxLength={1500}
          value={highSchoolData.motivationLetter}
          onChange={(e) => setHighSchoolData(prev => ({ ...prev, motivationLetter: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your motivation letter here..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {highSchoolData.motivationLetter.length}/1500 characters
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src="/bgf-logo.png" 
              alt="Bridging Gaps Foundation" 
              className="h-12 w-auto bg-white p-1 rounded"
            />
            <div>
              <h2 className="text-2xl font-bold">
                Bridging Gaps Foundation
              </h2>
              <p className="text-blue-100">
                {isEditing ? 'Edit Application' : 'New Application Form'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Application Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Application Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicationTypes.map((type) => (
                <div
                  key={type.id}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    applicationType === type.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setApplicationType(type.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${type.color} p-2 rounded-lg`}>
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                    {applicationType === type.id && (
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          {applicationType === 'small_grants' && renderSmallGrantForm()}
          {applicationType === 'high_school_scholarship' && renderHighSchoolForm()}
          
          {(applicationType === 'excellence_scholarship' || applicationType === 'medical_assistance') && (
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Form Under Development</h3>
              </div>
              <p className="text-yellow-700 mt-2">
                The {applicationTypes.find(t => t.id === applicationType)?.name} application form is currently being developed. 
                Please contact our office directly for this type of application.
              </p>
            </div>
          )}

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600" />
              Supporting Documents
            </h3>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Required Documents:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                {applicationType === 'small_grants' && (
                  <>
                    <div>• Project proposal document</div>
                    <div>• Budget breakdown</div>
                    <div>• Applicant identification</div>
                    <div>• Community support letters</div>
                  </>
                )}
                {applicationType === 'high_school_scholarship' && (
                  <>
                    <div>• Certified copies of ID or birth certificate</div>
                    <div>• Certified copies of Guardian's ID</div>
                    <div>• Proof of address (guardian)</div>
                    <div>• School acceptance/registration letter</div>
                    <div>• Recent academic reports signed by school head</div>
                    <div>• School fees invoice/quotation</div>
                  </>
                )}
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PDF, DOC, DOCX, JPG, PNG (Max 5MB each)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Choose Files
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Declaration */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>I, the undersigned, hereby declare that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>I understand the questions in this application form</li>
                <li>All information and supporting documents submitted are true, correct and complete</li>
                <li>Any misrepresentation may result in cancellation of the scholarship or repayment of award</li>
                <li>I will provide proof of successful completion of courses if awarded</li>
                <li>Successful submission does not guarantee receiving the scholarship</li>
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

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              type="submit"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Send className="h-5 w-5" />
              <span>{isEditing ? 'Update Application' : 'Submit Application'}</span>
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedBGFApplicationForm;