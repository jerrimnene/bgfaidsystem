'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  User,
  FileImage,
  Clock
} from 'lucide-react';
import { ApplicationType, ApplicationFormData, DocumentInfo } from '@/types';
import { applicationsApi, uploadFile } from '@/utils/api';

// Form validation schemas for different application types
const baseSchema = z.object({
  type: z.enum(['small_grant', 'high_school_scholarship', 'excellence_scholarship', 'medical_assistance']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
  amount_requested: z.number().optional(),
  currency: z.string().default('USD'),
});

const personalInfoSchema = z.object({
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  age: z.number().min(1).max(100),
  gender: z.enum(['male', 'female', 'other']),
  id_number: z.string().min(5, 'ID number required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  address: z.string().min(10, 'Address required'),
  city: z.string().min(2, 'City required'),
  country: z.string().min(2, 'Country required'),
});

const smallGrantSchema = baseSchema.extend({
  personal_info: personalInfoSchema.extend({
    occupation: z.string().min(2, 'Occupation required'),
    organization: z.string().optional(),
    experience_years: z.number().min(0).max(50),
  }),
  project_details: z.object({
    project_name: z.string().min(5, 'Project name required'),
    beneficiaries_count: z.number().min(1, 'Number of beneficiaries required'),
    location: z.string().min(3, 'Project location required'),
    duration_months: z.number().min(1).max(24),
    objectives: z.array(z.string()).min(1, 'At least one objective required'),
    budget_breakdown: z.array(z.object({
      category: z.string(),
      amount: z.number(),
      description: z.string(),
    })).min(1, 'Budget breakdown required'),
    sustainability_plan: z.string().min(50, 'Sustainability plan required'),
    expected_outcomes: z.array(z.string()).min(1, 'Expected outcomes required'),
  }),
});

const scholarshipSchema = baseSchema.extend({
  personal_info: personalInfoSchema.extend({
    education_level: z.string().min(2, 'Education level required'),
    current_institution: z.string().optional(),
    grades: z.string().min(1, 'Academic performance required'),
    family_income: z.enum(['low', 'medium', 'high']),
    dependents: z.number().min(0),
    guardian_name: z.string().optional(),
    guardian_contact: z.string().optional(),
  }),
  project_details: z.object({
    target_institution: z.string().min(5, 'Target institution required'),
    program: z.string().min(5, 'Program/Course required'),
    duration_years: z.number().min(1).max(10),
    career_goals: z.string().min(100, 'Career goals required (min 100 characters)'),
    academic_achievements: z.array(z.string()).optional(),
    extracurricular: z.array(z.string()).optional(),
    financial_need_explanation: z.string().min(100, 'Financial need explanation required'),
  }),
});

const medicalSchema = baseSchema.extend({
  personal_info: personalInfoSchema.extend({
    medical_condition: z.string().min(10, 'Medical condition details required'),
    current_treatment: z.string().optional(),
    allergies: z.string().optional(),
    emergency_contact_name: z.string().min(2, 'Emergency contact required'),
    emergency_contact_phone: z.string().min(10, 'Emergency contact phone required'),
    insurance_status: z.enum(['none', 'partial', 'full']),
  }),
  project_details: z.object({
    treatment_type: z.string().min(5, 'Treatment type required'),
    hospital_preference: z.string().optional(),
    doctor_name: z.string().optional(),
    urgency_level: z.enum(['low', 'medium', 'high', 'emergency']),
    treatment_duration: z.string().min(5, 'Treatment duration required'),
    medical_history: z.string().min(50, 'Medical history required'),
    current_medications: z.array(z.string()).optional(),
    estimated_cost: z.number().optional(),
  }),
});

interface ApplicationFormProps {
  type: ApplicationType;
  initialData?: Partial<ApplicationFormData>;
  onSuccess?: (application: any) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  applicationId?: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  type,
  initialData,
  onSuccess,
  onCancel,
  isEditing = false,
  applicationId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentInfo[]>([]);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Select appropriate schema based on application type
  const getSchema = (appType: ApplicationType) => {
    switch (appType) {
      case 'small_grant':
        return smallGrantSchema;
      case 'high_school_scholarship':
      case 'excellence_scholarship':
        return scholarshipSchema;
      case 'medical_assistance':
        return medicalSchema;
      default:
        return baseSchema;
    }
  };

  const schema = getSchema(type);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type,
      currency: 'USD',
      personal_info: {},
      project_details: {},
      ...initialData,
    },
  });

  // Watch form values for dynamic updates
  const watchedType = watch('type');
  
  useEffect(() => {
    if (initialData) {
      reset({ ...initialData, type });
    }
  }, [initialData, type, reset]);

  // File upload configuration based on application type
  const getRequiredDocuments = (appType: ApplicationType) => {
    const baseDocuments = [
      { category: 'id_document', label: 'National ID/Passport', required: true },
    ];

    switch (appType) {
      case 'small_grant':
        return [
          ...baseDocuments,
          { category: 'project_proposal', label: 'Project Proposal', required: true },
          { category: 'budget_breakdown', label: 'Budget Breakdown', required: true },
          { category: 'organization_letter', label: 'Organization Letter', required: false },
        ];
      case 'high_school_scholarship':
      case 'excellence_scholarship':
        return [
          ...baseDocuments,
          { category: 'academic_records', label: 'Academic Records', required: true },
          { category: 'admission_letter', label: 'School Admission Letter', required: true },
          { category: 'recommendation_letter', label: 'Recommendation Letter', required: appType === 'excellence_scholarship' },
          { category: 'financial_statement', label: 'Family Financial Statement', required: false },
        ];
      case 'medical_assistance':
        return [
          ...baseDocuments,
          { category: 'medical_report', label: 'Medical Report', required: true },
          { category: 'doctor_recommendation', label: 'Doctor Recommendation', required: true },
          { category: 'cost_estimate', label: 'Treatment Cost Estimate', required: true },
          { category: 'medical_history', label: 'Medical History', required: false },
        ];
      default:
        return baseDocuments;
    }
  };

  const requiredDocuments = getRequiredDocuments(type);

  // File upload handling
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        try {
          const result = await uploadFile(file, 'application_document');
          const newDoc: DocumentInfo = {
            id: Date.now().toString(),
            filename: result.filename,
            category: 'general',
            url: result.url,
            size: file.size,
            mime_type: file.type,
            uploaded_at: new Date().toISOString(),
            is_verified: false,
          };
          setUploadedDocuments(prev => [...prev, newDoc]);
          toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    },
  });

  const removeDocument = (docId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const categorizeDocument = (docId: string, category: string) => {
    setUploadedDocuments(prev =>
      prev.map(doc => doc.id === docId ? { ...doc, category } : doc)
    );
  };

  // Form submission
  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Add uploaded documents to form data
      const formDataWithDocuments = {
        ...data,
        documents: uploadedDocuments,
      };

      let response;
      if (isEditing && applicationId) {
        response = await applicationsApi.updateApplication(applicationId, formDataWithDocuments);
      } else {
        response = await applicationsApi.createApplication(formDataWithDocuments);
      }

      if (response.success) {
        toast.success(isEditing ? 'Application updated successfully!' : 'Application submitted successfully!');
        onSuccess?.(response.data);
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation between steps
  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Render different form sections based on step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderPersonalInformation();
      case 3:
        return renderProjectDetails();
      case 4:
        return renderDocumentUpload();
      default:
        return null;
    }
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Type
        </label>
        <select
          {...register('type')}
          disabled={isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
        >
          <option value="small_grant">Small Grant</option>
          <option value="high_school_scholarship">High School Scholarship</option>
          <option value="excellence_scholarship">Excellence Scholarship</option>
          <option value="medical_assistance">Medical Assistance</option>
        </select>
        {errors.type && (
          <p className="text-red-600 text-sm mt-1">{String(errors.type?.message || '')}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          {...register('title')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Brief title for your application"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{String(errors.title?.message || '')}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          {...register('description')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Detailed description of your request/need"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{String(errors.description?.message || '')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Requested
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              {...register('amount_requested', { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0.00"
            />
          </div>
          {errors.amount_requested && (
            <p className="text-red-600 text-sm mt-1">{String(errors.amount_requested?.message || '')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            {...register('currency')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="USD">USD ($)</option>
            <option value="ZWL">ZWL (Z$)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            {...register('personal_info.first_name')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.personal_info?.first_name && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.first_name?.message || '')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            {...register('personal_info.last_name')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.personal_info?.last_name && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.last_name?.message || '')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            {...register('personal_info.age', { valueAsNumber: true })}
            type="number"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.personal_info?.age && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.age?.message || '')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            {...register('personal_info.gender')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.personal_info?.gender && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.gender?.message || '')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Number *
          </label>
          <input
            {...register('personal_info.id_number')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.personal_info?.id_number && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.id_number?.message || '')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            {...register('personal_info.phone')}
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="+263771234567"
          />
          {errors.personal_info?.phone && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.phone?.message || '')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            {...register('personal_info.email')}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.personal_info?.email && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.email?.message || '')}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <textarea
          {...register('personal_info.address')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Full residential address"
        />
        {errors.personal_info?.address && (
          <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.address?.message || '')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            {...register('personal_info.city')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.personal_info?.city && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.city?.message || '')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <input
            {...register('personal_info.country')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            defaultValue="Zimbabwe"
          />
          {errors.personal_info?.country && (
            <p className="text-red-600 text-sm mt-1">{String(errors.personal_info.country?.message || '')}</p>
          )}
        </div>
      </div>

      {/* Application-specific personal information */}
      {type === 'small_grant' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation *
              </label>
              <input
                {...register('personal_info.occupation')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                {...register('personal_info.experience_years', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </>
      )}

      {(type === 'high_school_scholarship' || type === 'excellence_scholarship') && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Education Level *
              </label>
              <select
                {...register('personal_info.education_level')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Level</option>
                <option value="O-Level">O-Level</option>
                <option value="A-Level">A-Level</option>
                <option value="Diploma">Diploma</option>
                <option value="Degree">Degree</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Performance *
              </label>
              <input
                {...register('personal_info.grades')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 5 As, 3.8 GPA"
              />
            </div>
          </div>
        </>
      )}

      {type === 'medical_assistance' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Condition *
            </label>
            <textarea
              {...register('personal_info.medical_condition')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Please describe your medical condition in detail"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Name *
              </label>
              <input
                {...register('personal_info.emergency_contact_name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Phone *
              </label>
              <input
                {...register('personal_info.emergency_contact_phone')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderProjectDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {type === 'small_grant' ? 'Project Details' : 
         type.includes('scholarship') ? 'Educational Details' : 
         'Treatment Details'}
      </h3>

      {type === 'small_grant' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              {...register('project_details.project_name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Beneficiaries *
              </label>
              <input
                {...register('project_details.beneficiaries_count', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Location *
              </label>
              <input
                {...register('project_details.location')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Months) *
              </label>
              <input
                {...register('project_details.duration_months', { valueAsNumber: true })}
                type="number"
                min="1"
                max="24"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sustainability Plan *
            </label>
            <textarea
              {...register('project_details.sustainability_plan')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="How will this project be sustained after completion?"
            />
          </div>
        </>
      )}

      {(type === 'high_school_scholarship' || type === 'excellence_scholarship') && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Institution *
              </label>
              <input
                {...register('project_details.target_institution')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Name of school/university"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program/Course *
              </label>
              <input
                {...register('project_details.program')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Years) *
            </label>
            <input
              {...register('project_details.duration_years', { valueAsNumber: true })}
              type="number"
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Career Goals *
            </label>
            <textarea
              {...register('project_details.career_goals')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe your career aspirations and how this education will help you achieve them"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Need Explanation *
            </label>
            <textarea
              {...register('project_details.financial_need_explanation')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Explain why you need financial assistance and your family's financial situation"
            />
          </div>
        </>
      )}

      {type === 'medical_assistance' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Type *
              </label>
              <input
                {...register('project_details.treatment_type')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Surgery, Chemotherapy, Dialysis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level *
              </label>
              <select
                {...register('project_details.urgency_level')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Urgency</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical History *
            </label>
            <textarea
              {...register('project_details.medical_history')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Provide detailed medical history relevant to this condition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment Duration *
            </label>
            <input
              {...register('project_details.treatment_duration')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 3 months, 6 sessions, ongoing"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-primary-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop your documents here, or <span className="text-primary-600">click to browse</span>
            </p>
            <p className="text-sm text-gray-500">
              Support for PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
            </p>
          </div>
        )}
      </div>

      {/* Required Documents Checklist */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Required Documents:</h4>
        <div className="space-y-2">
          {requiredDocuments.map((doc) => {
            const uploaded = uploadedDocuments.some(ud => ud.category === doc.category);
            return (
              <div key={doc.category} className="flex items-center space-x-2">
                {uploaded ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : doc.required ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm ${
                  uploaded ? 'text-green-600' : doc.required ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {doc.label} {doc.required && '*'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Uploaded Documents:</h4>
          {uploadedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                  <p className="text-xs text-gray-500">
                    {(doc.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={doc.category}
                  onChange={(e) => categorizeDocument(doc.id, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="general">General</option>
                  {requiredDocuments.map((reqDoc) => (
                    <option key={reqDoc.category} value={reqDoc.category}>
                      {reqDoc.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeDocument(doc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${stepNumber < totalSteps ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNumber <= step
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    stepNumber < step ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Basic Info</span>
          <span>Personal</span>
          <span>Details</span>
          <span>Documents</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Cancel
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : isEditing ? 'Update Application' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;