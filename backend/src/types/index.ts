// User Types
export type UserRole = 
  | 'applicant' 
  | 'project_officer' 
  | 'program_manager' 
  | 'finance_director' 
  | 'hospital_director' 
  | 'executive_director' 
  | 'ceo' 
  | 'founder' 
  | 'admin';

export interface User {
  id: string;
  email: string;
  password_hash?: string; // Optional for responses
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  profile_picture_url?: string;
  address?: string;
  city?: string;
  country?: string;
  preferred_language: string;
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    telegram: boolean;
  };
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

// Application Types
export type ApplicationStatus = 
  | 'new_submission'
  | 'po_review'
  | 'manager_review' 
  | 'finance_review'
  | 'hospital_review'
  | 'executive_review'
  | 'ceo_review'
  | 'founder_review'
  | 'approved'
  | 'rejected'
  | 'edit_requested'
  | 'disbursed'
  | 'completed';

export type ApplicationType = 
  | 'medical_aid'
  | 'educational_aid'
  | 'emergency_aid'
  | 'business_aid'
  | 'community_project'
  | 'infrastructure'
  | 'other';

export interface Application {
  id: string;
  applicant_id: string;
  title: string;
  description: string;
  type: ApplicationType;
  status: ApplicationStatus;
  amount_requested?: number;
  amount_approved?: number;
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  personal_info: {
    full_name: string;
    id_number: string;
    phone: string;
    email: string;
    address: string;
    emergency_contact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  project_details: {
    objective: string;
    beneficiaries: number;
    timeline: string;
    budget_breakdown: Array<{
      item: string;
      cost: number;
      description?: string;
    }>;
  };
  assigned_po_id?: string;
  current_reviewer_id?: string;
  po_comments?: string;
  manager_comments?: string;
  finance_comments?: string;
  hospital_comments?: string;
  executive_comments?: string;
  ceo_comments?: string;
  founder_comments?: string;
  po_review_at?: Date;
  manager_review_at?: Date;
  finance_review_at?: Date;
  hospital_review_at?: Date;
  executive_review_at?: Date;
  ceo_review_at?: Date;
  founder_review_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// API Response Types
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

// Authentication Types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
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

// User Session Types
export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  refresh_token: string;
  expires_at: Date;
  is_active: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// File Upload Types
export interface FileUpload {
  id: string;
  application_id: string;
  uploaded_by: string;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_category?: string;
  is_verified: boolean;
  verified_by?: string;
  verified_at?: Date;
  created_at: Date;
}

// Workflow Types
export interface WorkflowAction {
  application_id: string;
  action: 'approve' | 'reject' | 'request_edit' | 'assign';
  comments?: string;
  assigned_to?: string;
}

// Query Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface ApplicationFilterQuery extends PaginationQuery {
  status?: ApplicationStatus;
  type?: ApplicationType;
  assigned_po_id?: string;
  applicant_id?: string;
  date_from?: string;
  date_to?: string;
}

// Express Request Extensions
declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: UserSession;
    }
  }
}