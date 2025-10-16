import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { 
  ApiResponse, 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest,
  User,
  Application,
  ApplicationFormData,
  WorkflowAction,
  DashboardStats,
  SystemSettings
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getAccessToken = (): string | null => {
  return Cookies.get('access_token') || null;
};

const getRefreshToken = (): string | null => {
  return Cookies.get('refresh_token') || null;
};

const setTokens = (tokens: AuthTokens): void => {
  const expiresIn = new Date(Date.now() + tokens.expires_in * 1000);
  Cookies.set('access_token', tokens.access_token, { expires: expiresIn, secure: true, sameSite: 'strict' });
  Cookies.set('refresh_token', tokens.refresh_token, { expires: 30, secure: true, sameSite: 'strict' }); // 30 days
};

const removeTokens = (): void => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const tokens: AuthTokens = response.data.data;
          setTokens(tokens);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          removeTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      } else {
        // No refresh token, redirect to login
        removeTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    // Handle other errors
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error('An unexpected error occurred');
    }

    return Promise.reject(error);
  }
);

// API helper function
const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api[method](endpoint, data, config);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { success: false, error: 'Network error' };
  }
};

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    const response = await apiRequest<{ user: User; tokens: AuthTokens }>('post', '/auth/login', credentials);
    if (response.success && response.data) {
      setTokens(response.data.tokens);
    }
    return response;
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    const response = await apiRequest<{ user: User; tokens: AuthTokens }>('post', '/auth/register', userData);
    if (response.success && response.data) {
      setTokens(response.data.tokens);
    }
    return response;
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      await apiRequest('post', '/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      removeTokens();
    }
    return { success: true };
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    // Check if we have mock data in localStorage (for demo mode)
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        return { success: true, data: user };
      } catch (error) {
        // If parsing fails, continue to API call
      }
    }
    return apiRequest<User>('get', '/auth/me');
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return authApi.getCurrentUser();
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiRequest<User>('put', '/auth/profile', userData);
  },

  changePassword: async (passwords: { current_password: string; new_password: string }): Promise<ApiResponse> => {
    return apiRequest('post', '/auth/change-password', passwords);
  },
};

// Applications API
export const applicationsApi = {
  getApplications: async (params?: Record<string, any>): Promise<ApiResponse<Application[]>> => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest<Application[]>('get', `/applications${queryString ? `?${queryString}` : ''}`);
  },

  getApplicationById: async (id: string): Promise<ApiResponse<Application>> => {
    return apiRequest<Application>('get', `/applications/${id}`);
  },

  createApplication: async (applicationData: ApplicationFormData): Promise<ApiResponse<Application>> => {
    return apiRequest<Application>('post', '/applications', applicationData);
  },

  createPublicApplication: async (applicationData: ApplicationFormData): Promise<ApiResponse<Application>> => {
    // Use axios directly to bypass auth interceptor for public endpoint
    try {
      const response = await axios.post(`${API_URL}/applications/public`, applicationData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, error: 'Network error' };
    }
  },

  updateApplication: async (id: string, applicationData: Partial<ApplicationFormData>): Promise<ApiResponse<Application>> => {
    return apiRequest<Application>('put', `/applications/${id}`, applicationData);
  },

  deleteApplication: async (id: string): Promise<ApiResponse> => {
    return apiRequest('delete', `/applications/${id}`);
  },

  executeWorkflowAction: async (id: string, action: WorkflowAction): Promise<ApiResponse> => {
    return apiRequest('post', `/applications/${id}/actions`, action);
  },

  getApplicationStats: async (): Promise<ApiResponse<DashboardStats>> => {
    // Mock data for demo mode
    const mockStats: DashboardStats = {
      total_applications: 25,
      pending_review: 8,
      approved_applications: 12,
      rejected_applications: 3,
      total_disbursed: 85000,
      applications_by_type: {
        'small_grant': 10,
        'medical_assistance': 8,
        'high_school_scholarship': 5,
        'excellence_scholarship': 2
      },
      applications_by_status: {
        'new_submission': 3,
        'po_review': 5,
        'completed': 12,
        'po_rejected': 3,
        'manager_review': 2
      },
      monthly_applications: [
        { month: '2024-01', count: 5 },
        { month: '2024-02', count: 8 },
        { month: '2024-03', count: 12 },
      ]
    };
    
    // Return mock data immediately for demo
    return Promise.resolve({ success: true, data: mockStats });
    
    // Uncomment this for real API calls:
    // return apiRequest<DashboardStats>('get', '/applications/stats');
  },

  getPendingApplications: async (params?: Record<string, any>): Promise<ApiResponse<Application[]>> => {
    // Mock pending applications for demo
    const mockApplications: Application[] = [
      {
        id: '1',
        application_id: 'BGF-2024-001',
        applicant_id: '1',
        type: 'small_grant',
        status: 'po_review',
        title: 'Community Garden Project',
        description: 'Establishing a community garden to provide fresh produce for local families',
        amount_requested: 5000,
        currency: 'USD',
        personal_info: {},
        project_details: {},
        documents: [],
        priority_level: 2,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        applicant_first_name: 'John',
        applicant_last_name: 'Doe',
        applicant_email: 'john@example.com'
      },
      {
        id: '2',
        application_id: 'BGF-2024-002',
        applicant_id: '2',
        type: 'medical_assistance',
        status: 'manager_review',
        title: 'Emergency Medical Treatment',
        description: 'Medical assistance for urgent surgery',
        amount_requested: 15000,
        currency: 'USD',
        personal_info: {},
        project_details: {},
        documents: [],
        priority_level: 4,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        applicant_first_name: 'Jane',
        applicant_last_name: 'Smith',
        applicant_email: 'jane@example.com'
      }
    ];
    
    return Promise.resolve({ success: true, data: mockApplications });
  },


  reviewApplication: async (id: string, review: any): Promise<ApiResponse> => {
    // Mock review action - just return success
    return Promise.resolve({ success: true, message: 'Application reviewed successfully' });
  },
};

// Users API (Admin)
export const usersApi = {
  getUsers: async (params?: Record<string, any>): Promise<ApiResponse<User[]>> => {
    // Mock users for demo
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@bgf.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user@example.com',
        first_name: 'Demo',
        last_name: 'User',
        role: 'applicant',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      },
      {
        id: '3',
        email: 'officer@bgf.com',
        first_name: 'Project',
        last_name: 'Officer',
        role: 'project_officer',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }
    ];
    
    return Promise.resolve({ success: true, data: mockUsers });
  },

  updateUserRole: async (id: string, role: string): Promise<ApiResponse<User>> => {
    // Mock update - return success
    const mockUser = {
      id,
      email: 'updated@example.com',
      first_name: 'Updated',
      last_name: 'User',
      role: role as any,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return Promise.resolve({ success: true, data: mockUser });
  },

  toggleUserStatus: async (id: string, is_active: boolean): Promise<ApiResponse<User>> => {
    // Mock toggle - return success
    const mockUser = {
      id,
      email: 'updated@example.com',
      first_name: 'Updated',
      last_name: 'User',
      role: 'applicant' as any,
      status: (is_active ? 'active' : 'inactive') as 'active' | 'inactive',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return Promise.resolve({ success: true, data: mockUser });
  },
};



// System Settings API
export const settingsApi = {
  getSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    return apiRequest<SystemSettings>('get', '/settings');
  },

  getPublicSettings: async (): Promise<ApiResponse<Record<string, any>>> => {
    return apiRequest<Record<string, any>>('get', '/settings/public');
  },

  updateSetting: async (key: string, value: any, description?: string, isPublic = false): Promise<ApiResponse> => {
    return apiRequest('put', `/settings/${key}`, {
      value,
      description,
      is_public: isPublic,
    });
  },
};

// File upload helper
export const uploadFile = async (file: File, category: string): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);

  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      // You can emit progress events here if needed
      console.log(`Upload progress: ${percentCompleted}%`);
    },
  });

  return response.data.data;
};

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const getUserFromToken = (): Partial<User> | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

// Export the configured axios instance for custom requests
export { api as apiClient };

export default api;