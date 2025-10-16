// Shared types for BGF Aid Frontend Application

export type UserRole = 
  | 'applicant'
  | 'project_officer'
  | 'program_manager'
  | 'finance_director'
  | 'hospital_director'
  | 'executive_director'
  | 'ceo'
  | 'founder'
  | 'finance_release'
  | 'hospital_acceptance'
  | 'admin';

export type ApplicationType = 
  | 'small_grant'
  | 'high_school_scholarship'
  | 'excellence_scholarship'
  | 'medical_assistance';

export type ApplicationStatus = 
  | 'new_submission'
  | 'po_review'
  | 'po_approved'
  | 'po_rejected'
  | 'edit_requested'
  | 'manager_review'
  | 'manager_approved'
  | 'manager_rejected'
  | 'finance_review'
  | 'hospital_review'
  | 'finance_approved'
  | 'hospital_approved'
  | 'executive_review'
  | 'executive_approved'
  | 'executive_rejected'
  | 'ceo_review'
  | 'ceo_approved'
  | 'ceo_rejected'
  | 'founder_review'
  | 'founder_approved'
  | 'founder_rejected'
  | 'completed'
  | 'cancelled';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  is_active?: boolean;
  email_verified?: boolean;
  phone_verified?: boolean;
  profile_picture_url?: string;
  address?: string;
  city?: string;
  country?: string;
  preferred_language?: string;
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    telegram: boolean;
  };
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  last_login?: string;
}

export interface Application {
  id: string;
  application_id: string;
  applicant_id: string;
  assigned_po_id?: string;
  type: ApplicationType;
  status: ApplicationStatus;
  title: string;
  description: string;
  amount_requested?: number;
  amount_approved?: number;
  currency: string;
  personal_info: Record<string, any>;
  project_details: Record<string, any>;
  documents: DocumentInfo[];
  current_reviewer_id?: string;
  priority_level: number;
  po_comments?: string;
  manager_comments?: string;
  finance_comments?: string;
  hospital_comments?: string;
  executive_comments?: string;
  ceo_comments?: string;
  founder_comments?: string;
  submitted_at: string;
  po_reviewed_at?: string;
  manager_reviewed_at?: string;
  finance_reviewed_at?: string;
  hospital_reviewed_at?: string;
  executive_reviewed_at?: string;
  ceo_reviewed_at?: string;
  founder_reviewed_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  
  // Extended fields from joins
  applicant_first_name?: string;
  applicant_last_name?: string;
  applicant_email?: string;
  po_first_name?: string;
  po_last_name?: string;
  reviewer_first_name?: string;
  reviewer_last_name?: string;
  
  // Workflow information
  workflow?: WorkflowStatus;
}

export interface DocumentInfo {
  id: string;
  filename: string;
  category: string;
  url: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
  is_verified: boolean;
}

export interface WorkflowStatus {
  current_status: ApplicationStatus;
  available_actions: Array<{
    action: string;
    label: string;
    requires_comments: boolean;
    button_class: string;
  }>;
  workflow_history: Array<{
    status: ApplicationStatus;
    action: string;
    user_name: string;
    comments?: string;
    timestamp: string;
  }>;
  next_reviewers: User[];
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  preferred_language?: string;
}

export interface ApplicationFormData {
  type: ApplicationType;
  title: string;
  description: string;
  amount_requested?: number;
  currency: string;
  personal_info: Record<string, any>;
  project_details: Record<string, any>;
  priority_level?: number;
}

export interface WorkflowAction {
  application_id: string;
  action: 'approve' | 'reject' | 'request_edit' | 'assign';
  comments?: string;
  assigned_to?: string;
}

export interface DashboardStats {
  total_applications: number;
  pending_review: number;
  approved_applications: number;
  rejected_applications?: number;
  total_disbursed: number;
  applications_by_type: Record<string, number>;
  applications_by_status: Record<string, number>;
  monthly_applications: Array<{ month: string; count: number }>;
}

export interface SystemStats {
  total_applications: number;
  pending_review: number;
  approved_applications: number;
  total_disbursed: number;
}

export interface MEReport {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface ImpactData {
  metric: string;
  value: number;
  description: string;
}

export interface WorkflowStep {
  step: string;
  status: ApplicationStatus;
  completed: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  telegram: boolean;
}

export interface SystemSettings {
  [key: string]: {
    value: any;
    description?: string;
    is_public: boolean;
  };
}

// Form validation schemas
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// UI Component Props
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

// Language support
export interface Language {
  code: string;
  name: string;
  native: string;
}

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

// M&E Types
export interface MonitoringEvaluation {
  id: string;
  application_id: string;
  beneficiary_name: string;
  beneficiary_contact?: string;
  beneficiary_email?: string;
  total_amount: number;
  disbursed_amount: number;
  remaining_amount: number;
  disbursements: DisbursementRecord[];
  impact_metrics: Record<string, any>;
  progress_reports: ProgressReport[];
  follow_up_schedule: FollowUpItem[];
  completed_follow_ups: FollowUpItem[];
  hospital_service_details?: Record<string, any>;
  treatment_completion_date?: string;
  is_active: boolean;
  completion_status: string;
  created_at: string;
  updated_at: string;
}

export interface DisbursementRecord {
  id: string;
  amount: number;
  disbursement_date: string;
  method: string;
  reference: string;
  notes?: string;
  disbursed_by: string;
}

export interface ProgressReport {
  id: string;
  report_date: string;
  title: string;
  content: string;
  attachments: string[];
  submitted_by: string;
}

export interface FollowUpItem {
  id: string;
  scheduled_date: string;
  type: string;
  description: string;
  status: string;
  completed_date?: string;
  notes?: string;
}