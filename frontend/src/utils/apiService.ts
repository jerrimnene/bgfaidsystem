// API Service for BGF Aid Management System
// Connects frontend to backend instead of using localStorage

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Application {
  id: string;
  title: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
  };
  type: 'small_grants' | 'high_school_scholarship' | 'excellence_scholarship' | 'medical_assistance';
  amount: number;
  currentStep: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_info' | 'completed';
  submittedDate: string;
  lastUpdated: string;
  documents: string[];
  formData: any;
  workflow?: any[];
  currentReviewer?: string;
  currentReviewerRole?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  categories?: string[];
  beneficiaries?: number;
  assignmentHistory?: any[];
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            try {
              const response = await this.api.post('/auth/refresh', {
                refreshToken,
              });
              
              if (response.data.success) {
                this.setToken(response.data.data.token);
                originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
                return this.api(originalRequest);
              }
            } catch (refreshError) {
              this.logout();
              window.location.href = '/auth/login';
            }
          } else {
            this.logout();
            window.location.href = '/auth/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bgf_token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgf_token', token);
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bgf_refresh_token');
    }
    return null;
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgf_refresh_token', token);
    }
  }

  private removeTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bgf_token');
      localStorage.removeItem('bgf_refresh_token');
      localStorage.removeItem('bgf_user');
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      this.setToken(response.data.data.token);
      this.setRefreshToken(response.data.data.refreshToken);
      
      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('bgf_user', JSON.stringify(response.data.data.user));
      }
    }
    
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: string;
  }): Promise<ApiResponse<User>> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeTokens();
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/auth/me');
    
    if (response.data.success && typeof window !== 'undefined') {
      localStorage.setItem('bgf_user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  }

  // Application methods
  async submitApplication(formData: any, files: File[]): Promise<ApiResponse<Application>> {
    const applicationData = {
      title: formData.projectTitle || formData.title || `${formData.applicationType} Application`,
      type: formData.applicationType,
      amount: formData.fundingRequestAmount || formData.amountRequested || 0,
      form_data: formData,
      priority: this.determinePriority(formData),
      categories: this.determineCategories(formData),
      beneficiaries: formData.beneficiaries || formData.numberOfBeneficiaries || 1,
    };

    // Submit application first
    const response = await this.api.post('/applications', applicationData);
    
    // If successful and files provided, upload files
    if (response.data.success && files.length > 0) {
      const applicationId = response.data.data.id;
      await this.uploadApplicationFiles(applicationId, files);
    }
    
    return response.data;
  }

  async uploadApplicationFiles(applicationId: string, files: File[]): Promise<ApiResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await this.api.post(`/applications/${applicationId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  async getApplications(filters?: {
    status?: string;
    type?: string;
    assigned_to_me?: boolean;
  }): Promise<ApiResponse<Application[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await this.api.get(`/applications?${params}`);
    return response.data;
  }

  async getApplicationById(id: string): Promise<ApiResponse<Application>> {
    const response = await this.api.get(`/applications/${id}`);
    return response.data;
  }

  async assignApplication(
    applicationId: string, 
    assignedTo: string, 
    reason?: string
  ): Promise<ApiResponse> {
    const response = await this.api.post(`/applications/${applicationId}/actions`, {
      action: 'assign',
      assigned_to: assignedTo,
      comments: reason,
    });
    return response.data;
  }

  async updateApplicationStatus(
    applicationId: string,
    action: 'approve' | 'reject' | 'request_info',
    comments?: string
  ): Promise<ApiResponse> {
    const response = await this.api.post(`/applications/${applicationId}/actions`, {
      action,
      comments,
    });
    return response.data;
  }

  async getApplicationStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }>> {
    const response = await this.api.get('/applications/stats');
    return response.data;
  }

  // User management methods
  async getUsers(filters?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<ApiResponse<{
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await this.api.get(`/users?${params}`);
    return response.data;
  }

  async getProjectOfficers(): Promise<ApiResponse<User[]>> {
    const response = await this.getUsers({ role: 'project_officer', limit: 100 });
    return {
      success: response.success,
      data: response.data?.data || [],
      error: response.error,
    };
  }

  // Helper methods
  private determinePriority(formData: any): 'low' | 'medium' | 'high' | 'urgent' {
    if (formData.applicationType === 'medical_assistance') {
      if (formData.urgencyLevel === 'critical') return 'urgent';
      if (formData.urgencyLevel === 'high') return 'high';
      return 'medium';
    }
    
    const amount = formData.fundingRequestAmount || formData.amountRequested || 0;
    if (amount > 50000) return 'high';
    if (amount > 10000) return 'medium';
    return 'low';
  }

  private determineCategories(formData: any): string[] {
    const categories = [];
    
    if (formData.applicationType === 'medical_assistance') {
      categories.push('Medical Care', 'Healthcare');
    } else if (formData.applicationType === 'high_school_scholarship' || formData.applicationType === 'excellence_scholarship') {
      categories.push('Education', 'Scholarship');
    } else if (formData.applicationType === 'small_grants') {
      categories.push('Community Development', 'Small Business');
    }
    
    if (formData.categories) {
      categories.push(...formData.categories);
    }
    
    return [...new Set(categories)];
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;