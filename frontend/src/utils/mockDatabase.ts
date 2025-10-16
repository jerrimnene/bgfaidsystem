// Database Interface for BGF Aid Management System
// Now connects to real backend API instead of localStorage

import { apiService, ApiResponse, Application as ApiApplication, User as ApiUser } from './apiService';

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
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submittedDate: string;
  lastUpdated: string;
  documents: string[];
  formData: any;
  workflow: WorkflowStep[];
  currentReviewer?: string;
  currentReviewerRole?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  categories?: string[];
  beneficiaries?: number;
  disbursements?: Disbursement[];
  medicalInfo?: MedicalInfo;
  assignmentHistory?: AssignmentRecord[];
}

export interface Disbursement {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank_transfer' | 'check' | 'mobile_money';
  reference: string;
  notes?: string;
}

export interface MedicalInfo {
  patientName: string;
  condition: string;
  hospital: string;
  estimatedCost: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  treatmentPlan?: string;
  doctorName?: string;
}

export interface AssignmentRecord {
  id: string;
  assignedTo: string;
  assignedBy: string;
  assignedDate: string;
  role: string;
  reason?: string;
}

export interface Report {
  id: string;
  type: 'finance' | 'impact' | 'disbursement' | 'medical';
  title: string;
  generatedBy: string;
  generatedDate: string;
  period: {
    from: string;
    to: string;
  };
  data: any;
  summary: ReportSummary;
}

export interface ReportSummary {
  totalApplications: number;
  totalAmount: number;
  approvalRate: number;
  averageProcessingTime: number;
  additionalMetrics?: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  step: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reviewerName?: string;
  reviewerEmail?: string;
  comments?: string;
  actionDate?: string;
  actionRequired?: boolean;
}

const WORKFLOW_STEPS = [
  { step: 'submitted', role: 'applicant', label: 'Application Submitted' },
  { step: 'program_manager_review', role: 'program_manager', label: 'Program Manager Review' },
  { step: 'project_officer_review', role: 'project_officer', label: 'Project Officer Review' },
  { step: 'finance_director_review', role: 'finance_director', label: 'Finance Director Review' },
  { step: 'hospital_director_review', role: 'hospital_director', label: 'Hospital Director Review' },
  { step: 'executive_director_review', role: 'executive_director', label: 'Executive Director Review' },
  { step: 'ceo_review', role: 'ceo', label: 'CEO Review' },
  { step: 'founder_review', role: 'founder', label: 'Founder Review' },
  { step: 'finance_release', role: 'finance_release', label: 'Finance Release' },
  { step: 'hospital_acceptance', role: 'hospital_acceptance', label: 'Hospital Acceptance' },
  { step: 'completed', role: 'system', label: 'Completed' }
];

class MockDatabase {
  private static instance: MockDatabase;
  private applications: Application[] = [];
  private reports: Report[] = [];
  private settings: Record<string, any> = {};
  private users: any[] = [];

  private constructor() {
    this.loadFromStorage();
    this.seedDemoApplications();
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const storedApps = localStorage.getItem('bgf_applications');
      if (storedApps) {
        this.applications = JSON.parse(storedApps);
      }
      
      const storedReports = localStorage.getItem('bgf_reports');
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
      }
      
      const storedSettings = localStorage.getItem('bgf_settings');
      if (storedSettings) {
        this.settings = JSON.parse(storedSettings);
      }
      
      const storedUsers = localStorage.getItem('bgf_users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgf_applications', JSON.stringify(this.applications));
      localStorage.setItem('bgf_reports', JSON.stringify(this.reports));
      localStorage.setItem('bgf_settings', JSON.stringify(this.settings));
      localStorage.setItem('bgf_users', JSON.stringify(this.users));
    }
  }

  // Create initial workflow steps
  private createWorkflowSteps(applicationType: string): WorkflowStep[] {
    let relevantSteps = WORKFLOW_STEPS;

    // Filter steps based on application type
    if (applicationType === 'medical_assistance') {
      // Medical assistance goes through hospital director
      relevantSteps = WORKFLOW_STEPS.filter(step => 
        !['finance_director_review'].includes(step.step) || 
        ['hospital_director_review', 'hospital_acceptance'].includes(step.step)
      );
    } else if (applicationType === 'high_school_scholarship') {
      // Scholarships don't need hospital director
      relevantSteps = WORKFLOW_STEPS.filter(step => 
        !['hospital_director_review', 'hospital_acceptance'].includes(step.step)
      );
    }

    return relevantSteps.map((step, index) => {
      // For program manager workflow, set program_manager_review as pending
      const isProgramManagerStep = step.step === 'program_manager_review';
      return {
        id: `${Date.now()}-${index}`,
        step: step.step,
        role: step.role,
        status: isProgramManagerStep ? 'pending' : (step.step === 'submitted' ? 'completed' : 'pending'),
        actionRequired: isProgramManagerStep // Program manager needs to take action first
      };
    });
  }

  // Submit new application
  async submitApplication(formData: any, files: File[]): Promise<string> {
    try {
      const response = await apiService.submitApplication(formData, files);
      
      if (response.success && response.data) {
        return response.data.id;
      } else {
        throw new Error(response.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  // Get all applications
  async getAllApplications(): Promise<Application[]> {
    try {
      const response = await apiService.getApplications();
      
      if (response.success && response.data) {
        return response.data.map(this.convertApiApplication);
      } else {
        console.error('Failed to get applications:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Error getting applications:', error);
      return [];
    }
  }

  // Get applications for specific user role
  async getApplicationsForRole(userRole: string, userEmail: string): Promise<Application[]> {
    try {
      let filters: any = {};
      
      // For project officers, only show applications assigned to them
      if (userRole === 'project_officer') {
        filters.assigned_to_me = true;
        filters.status = 'pending';
      }
      // For program managers and other roles, get pending applications at their review step
      else {
        filters.status = 'pending';
      }
      
      const response = await apiService.getApplications(filters);
      
      if (response.success && response.data) {
        return response.data.map(this.convertApiApplication);
      } else {
        console.error('Failed to get applications for role:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Error getting applications for role:', error);
      return [];
    }
  }

  // Get applications submitted by user (for applicants)
  getApplicationsByApplicant(userEmail: string): Application[] {
    return this.applications.filter(app => app.applicant.email === userEmail);
  }

  // Get specific application
  getApplication(id: string): Application | undefined {
    return this.applications.find(app => app.id === id);
  }

  // Helper method to convert API application to local format
  private convertApiApplication = (apiApp: ApiApplication): Application => {
    return {
      ...apiApp,
      status: apiApp.status as 'pending' | 'approved' | 'rejected' | 'completed',
      submittedDate: apiApp.submittedDate || new Date().toISOString(),
      lastUpdated: apiApp.lastUpdated || new Date().toISOString(),
      documents: apiApp.documents || [],
      workflow: apiApp.workflow || [],
    };
  };

  // Assign application to specific user (for program manager assignment)
  async assignApplicationToUser(
    applicationId: string,
    assignedToEmail: string,
    assignedByEmail: string,
    reason?: string
  ): Promise<boolean> {
    try {
      const response = await apiService.assignApplication(
        applicationId,
        assignedToEmail,
        reason
      );
      
      return response.success;
    } catch (error) {
      console.error('Error assigning application:', error);
      return false;
    }
  }

  // Update application workflow
  updateApplicationWorkflow(
    applicationId: string, 
    action: 'approve' | 'reject' | 'request_edit' | 'assign',
    reviewerEmail: string,
    reviewerName: string,
    comments?: string,
    assignedTo?: string
  ): boolean {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return false;

    // Find current pending step
    const currentStepIndex = app.workflow.findIndex(step => step.status === 'pending' && step.actionRequired);
    if (currentStepIndex === -1) return false;

    const currentStep = app.workflow[currentStepIndex];
    
    // Update current step
    currentStep.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending';
    currentStep.reviewerName = reviewerName;
    currentStep.reviewerEmail = reviewerEmail;
    currentStep.comments = comments;
    currentStep.actionDate = new Date().toISOString();
    currentStep.actionRequired = false;

    if (action === 'approve') {
      // Move to next step
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < app.workflow.length) {
        app.workflow[nextStepIndex].status = 'pending';
        app.workflow[nextStepIndex].actionRequired = true;
        app.currentStep = app.workflow[nextStepIndex].step;
        
        // Update current reviewer
        const nextStepRole = app.workflow[nextStepIndex].role;
        app.currentReviewerRole = nextStepRole;
        app.currentReviewer = this.getReviewerEmailForRole(nextStepRole);
      } else {
        // Application completed
        app.status = 'completed';
        app.currentStep = 'completed';
        app.currentReviewer = undefined;
        app.currentReviewerRole = undefined;
      }
    } else if (action === 'reject') {
      app.status = 'rejected';
    }

    this.saveToStorage();
    return true;
  }

  // Get reviewer email for role
  private getReviewerEmailForRole(role: string): string {
    const roleEmailMap: { [key: string]: string } = {
      'project_officer': 'project.officer@bgf.com',
      'program_manager': 'program.manager@bgf.com',
      'finance_director': 'finance.director@bgf.com',
      'hospital_director': 'hospital.director@bgf.com',
      'executive_director': 'executive.director@bgf.com',
      'ceo': 'ceo@bgf.com',
      'founder': 'founder.male@bgf.com',
      'finance_release': 'finance.release@bgf.com',
      'hospital_acceptance': 'hospital.acceptance@bgf.com'
    };
    return roleEmailMap[role] || '';
  }

  // Clear all applications (for testing)
  clearAllApplications() {
    this.applications = [];
    this.saveToStorage();
  }

  // Helper method to determine priority
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

  // Helper method to determine categories
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
    
    return Array.from(new Set(categories));
  }

  // Generate reports
  generateReport(type: 'finance' | 'impact' | 'disbursement' | 'medical', period: { from: string; to: string }, generatedBy: string): Report {
    const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
    const filteredApps = this.applications.filter(app => {
      const submittedDate = new Date(app.submittedDate);
      const fromDate = new Date(period.from);
      const toDate = new Date(period.to);
      return submittedDate >= fromDate && submittedDate <= toDate;
    });

    let data: any = {};
    let summary: ReportSummary;

    switch (type) {
      case 'finance':
        data = {
          totalDisbursed: filteredApps.reduce((sum, app) => sum + (app.status === 'completed' ? app.amount : 0), 0),
          pendingDisbursements: filteredApps.filter(app => app.status === 'pending').reduce((sum, app) => sum + app.amount, 0),
          applicationsByType: this.groupApplicationsByType(filteredApps),
          monthlyTrends: this.calculateMonthlyTrends(filteredApps)
        };
        break;
      case 'impact':
        data = {
          beneficiariesReached: filteredApps.reduce((sum, app) => sum + (app.beneficiaries || 0), 0),
          categoriesSupported: this.getCategoriesDistribution(filteredApps),
          geographicDistribution: this.getGeographicDistribution(filteredApps),
          successStories: this.getSuccessStories(filteredApps)
        };
        break;
      case 'disbursement':
        data = {
          totalDisbursements: this.getAllDisbursements(filteredApps),
          disbursementMethods: this.getDisbursementMethods(filteredApps),
          processingTimes: this.getProcessingTimes(filteredApps),
          failureRates: this.getFailureRates(filteredApps)
        };
        break;
      case 'medical':
        const medicalApps = filteredApps.filter(app => app.type === 'medical_assistance');
        data = {
          totalPatients: medicalApps.length,
          conditionsSupported: this.getConditionsDistribution(medicalApps),
          hospitalsPartnered: this.getHospitalDistribution(medicalApps),
          urgencyLevels: this.getUrgencyDistribution(medicalApps)
        };
        break;
    }

    summary = {
      totalApplications: filteredApps.length,
      totalAmount: filteredApps.reduce((sum, app) => sum + app.amount, 0),
      approvalRate: filteredApps.length > 0 ? (filteredApps.filter(app => app.status === 'completed').length / filteredApps.length) * 100 : 0,
      averageProcessingTime: this.calculateAverageProcessingTime(filteredApps)
    };

    const report: Report = {
      id: reportId,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date(period.from).toLocaleDateString()} to ${new Date(period.to).toLocaleDateString()}`,
      generatedBy,
      generatedDate: new Date().toISOString(),
      period,
      data,
      summary
    };

    this.reports.push(report);
    this.saveToStorage();
    
    return report;
  }

  // Get all reports
  getAllReports(): Report[] {
    return [...this.reports];
  }

  // Get reports by type
  getReportsByType(type: string): Report[] {
    return this.reports.filter(report => report.type === type);
  }

  // Settings management
  getSetting(key: string): any {
    return this.settings[key];
  }

  setSetting(key: string, value: any): void {
    this.settings[key] = value;
    this.saveToStorage();
  }

  getAllSettings(): Record<string, any> {
    return { ...this.settings };
  }

  // User management
  addUser(user: any): void {
    this.users.push({ ...user, id: `USR-${Date.now()}`, createdDate: new Date().toISOString() });
    this.saveToStorage();
  }

  updateUser(userId: string, updates: any): boolean {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex >= 0) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates, lastUpdated: new Date().toISOString() };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllUsers(): any[] {
    return [...this.users];
  }

  // Get project officers for assignment
  async getProjectOfficers(): Promise<any[]> {
    try {
      const response = await apiService.getProjectOfficers();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        console.error('Failed to get project officers:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Error getting project officers:', error);
      return [];
    }
  }

  // Assignment management
  assignApplication(applicationId: string, assignedTo: string, assignedBy: string, reason?: string): boolean {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return false;

    const assignment: AssignmentRecord = {
      id: `ASG-${Date.now()}`,
      assignedTo,
      assignedBy,
      assignedDate: new Date().toISOString(),
      role: app.currentReviewerRole || 'unknown',
      reason
    };

    if (!app.assignmentHistory) {
      app.assignmentHistory = [];
    }
    app.assignmentHistory.push(assignment);
    app.assignedTo = assignedTo;
    app.lastUpdated = new Date().toISOString();
    
    this.saveToStorage();
    return true;
  }

  // Helper methods for report generation
  private groupApplicationsByType(applications: Application[]) {
    return applications.reduce((acc, app) => {
      acc[app.type] = (acc[app.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateMonthlyTrends(applications: Application[]) {
    const trends: Record<string, number> = {};
    applications.forEach(app => {
      const month = new Date(app.submittedDate).toISOString().slice(0, 7);
      trends[month] = (trends[month] || 0) + app.amount;
    });
    return trends;
  }

  private getCategoriesDistribution(applications: Application[]) {
    const distribution: Record<string, number> = {};
    applications.forEach(app => {
      if (app.categories) {
        app.categories.forEach(category => {
          distribution[category] = (distribution[category] || 0) + 1;
        });
      }
    });
    return distribution;
  }

  private getGeographicDistribution(applications: Application[]) {
    // Mock geographic data - in real app would come from form data
    return {
      'Kampala': applications.length * 0.4,
      'Entebbe': applications.length * 0.2,
      'Jinja': applications.length * 0.15,
      'Other': applications.length * 0.25
    };
  }

  private getSuccessStories(applications: Application[]) {
    return applications.filter(app => app.status === 'completed').slice(0, 5).map(app => ({
      title: app.title,
      impact: `Supported ${app.beneficiaries} beneficiaries with ${app.amount} funding`,
      category: app.categories?.[0] || 'General'
    }));
  }

  private getAllDisbursements(applications: Application[]) {
    const allDisbursements: Disbursement[] = [];
    applications.forEach(app => {
      if (app.disbursements) {
        allDisbursements.push(...app.disbursements);
      }
    });
    return allDisbursements;
  }

  private getDisbursementMethods(applications: Application[]) {
    const methods: Record<string, number> = { 'bank_transfer': 0, 'check': 0, 'mobile_money': 0 };
    applications.forEach(app => {
      if (app.disbursements) {
        app.disbursements.forEach(disbursement => {
          methods[disbursement.method] = (methods[disbursement.method] || 0) + 1;
        });
      }
    });
    return methods;
  }

  private getProcessingTimes(applications: Application[]) {
    const times: number[] = [];
    applications.forEach(app => {
      if (app.status === 'completed') {
        const submitted = new Date(app.submittedDate);
        const completed = new Date(app.lastUpdated);
        const days = Math.floor((completed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
        times.push(days);
      }
    });
    return times;
  }

  private getFailureRates(applications: Application[]) {
    const total = applications.length;
    const failed = applications.filter(app => app.status === 'rejected').length;
    return total > 0 ? (failed / total) * 100 : 0;
  }

  private getConditionsDistribution(medicalApplications: Application[]) {
    const conditions: Record<string, number> = {};
    medicalApplications.forEach(app => {
      if (app.medicalInfo?.condition) {
        conditions[app.medicalInfo.condition] = (conditions[app.medicalInfo.condition] || 0) + 1;
      }
    });
    return conditions;
  }

  private getHospitalDistribution(medicalApplications: Application[]) {
    const hospitals: Record<string, number> = {};
    medicalApplications.forEach(app => {
      if (app.medicalInfo?.hospital) {
        hospitals[app.medicalInfo.hospital] = (hospitals[app.medicalInfo.hospital] || 0) + 1;
      }
    });
    return hospitals;
  }

  private getUrgencyDistribution(medicalApplications: Application[]) {
    const urgency: Record<string, number> = { 'low': 0, 'medium': 0, 'high': 0, 'critical': 0 };
    medicalApplications.forEach(app => {
      if (app.medicalInfo?.urgencyLevel) {
        urgency[app.medicalInfo.urgencyLevel] = (urgency[app.medicalInfo.urgencyLevel] || 0) + 1;
      }
    });
    return urgency;
  }

  private calculateAverageProcessingTime(applications: Application[]): number {
    const completedApps = applications.filter(app => app.status === 'completed');
    if (completedApps.length === 0) return 0;

    const totalDays = completedApps.reduce((sum, app) => {
      const submitted = new Date(app.submittedDate);
      const completed = new Date(app.lastUpdated);
      const days = Math.floor((completed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / completedApps.length);
  }

  // Seed demo applications for testing
  private seedDemoApplications() {
    if (typeof window !== 'undefined' && this.applications.length === 0) {
      const demoApps = [
        {
          projectTitle: 'Community Water Project',
          applicantName: 'John Mukamuri',
          email: 'john.mukamuri@example.com',
          phone: '+263 123 456 789',
          applicationType: 'small_grants',
          fundingRequestAmount: 15000,
          projectDescription: 'Building a borehole and water distribution system for rural community'
        },
        {
          projectTitle: 'High School Education Support',
          applicantName: 'Grace Moyo',
          email: 'grace.moyo@example.com', 
          phone: '+263 987 654 321',
          applicationType: 'high_school_scholarship',
          fundingRequestAmount: 2500,
          projectDescription: 'Scholarship for completing high school education'
        },
        {
          projectTitle: 'Medical Surgery Assistance',
          applicantName: 'Mary Chikwanha',
          email: 'mary.chik@example.com',
          phone: '+263 555 123 456',
          applicationType: 'medical_assistance', 
          fundingRequestAmount: 8000,
          projectDescription: 'Financial support for urgent heart surgery',
          urgencyLevel: 'high'
        }
      ];
      
      demoApps.forEach((appData, index) => {
        // Add some variation in submission timing
        const submissionTime = Date.now() - (index * 2 * 24 * 60 * 60 * 1000);
        const mockFiles: File[] = [];
        
        // Temporarily set Date.now to create different timestamps
        const originalNow = Date.now;
        Date.now = () => submissionTime;
        
        try {
          this.submitApplication(appData, mockFiles);
        } finally {
          Date.now = originalNow;
        }
      });
    }
  }

  // Get workflow statistics
  async getWorkflowStats(): Promise<{ total: number; pending: number; approved: number; rejected: number }> {
    try {
      const response = await apiService.getApplicationStats();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        console.error('Failed to get workflow stats:', response.error);
        return { total: 0, pending: 0, approved: 0, rejected: 0 };
      }
    } catch (error) {
      console.error('Error getting workflow stats:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }

  // Synchronous versions for immediate deployment fix
  getWorkflowStatsSync(): { total: number; pending: number; approved: number; rejected: number } {
    const total = this.applications.length;
    const pending = this.applications.filter(app => app.status === 'pending').length;
    const approved = this.applications.filter(app => app.status === 'approved').length;
    const rejected = this.applications.filter(app => app.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }

  getAllApplicationsSync(): Application[] {
    return this.applications;
  }

  getApplicationsForRoleSync(role: string, email: string): Application[] {
    return this.applications.filter(app => {
      if (app.currentReviewer === email) return true;
      if (app.currentReviewerRole === role) return true;
      return false;
    });
  }
}

export const mockDB = MockDatabase.getInstance();

// Mock users for team management
export const mockUsers = [
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
    email: 'project.officer@bgf.com',
    first_name: 'Sarah',
    last_name: 'Johnson',
    role: 'project_officer',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '3',
    email: 'program.manager@bgf.com',
    first_name: 'Michael',
    last_name: 'Brown',
    role: 'program_manager',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '4',
    email: 'finance.director@bgf.com',
    first_name: 'Elizabeth',
    last_name: 'Davis',
    role: 'finance_officer',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '5',
    email: 'hospital.director@bgf.com',
    first_name: 'Dr. James',
    last_name: 'Wilson',
    role: 'director',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '6',
    email: 'executive.director@bgf.com',
    first_name: 'Maria',
    last_name: 'Garcia',
    role: 'executive_director',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '7',
    email: 'ceo@bgf.com',
    first_name: 'Robert',
    last_name: 'Smith',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '8',
    email: 'founder.male@bgf.com',
    first_name: 'John',
    last_name: 'Founder',
    role: 'founder',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '9',
    email: 'founder.female@bgf.com',
    first_name: 'Jane',
    last_name: 'Founder',
    role: 'founder',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '10',
    email: 'medical.officer@bgf.com',
    first_name: 'Dr. Patricia',
    last_name: 'Martinez',
    role: 'medical_officer',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: '11',
    email: 'hospital.admin@bgf.com',
    first_name: 'Linda',
    last_name: 'Anderson',
    role: 'hospital_admin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  }
];
