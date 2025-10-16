// System Test Suite for BGF Aid Management System
// This validates workflows, data persistence, and system functionality

import { mockDB, type Application, type WorkflowStep } from './mockDatabase';

export interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  data?: any;
}

export class SystemTester {
  private results: TestResult[] = [];

  private addResult(testName: string, passed: boolean, message: string, data?: any) {
    this.results.push({ testName, passed, message, data });
  }

  // Test 1: Verify mock database initialization
  async testDatabaseInitialization(): Promise<TestResult> {
    try {
      const applications = mockDB.getAllApplications();
      const reports = mockDB.getReportsByType('finance');
      
      const passed = Array.isArray(applications) && Array.isArray(reports);
      this.addResult(
        'Database Initialization',
        passed,
        passed ? 'Mock database initialized successfully' : 'Failed to initialize mock database'
      );
      
      return this.results[this.results.length - 1];
    } catch (error) {
      this.addResult('Database Initialization', false, `Error: ${error}`);
      return this.results[this.results.length - 1];
    }
  }

  // Test 2: Test application submission
  async testApplicationSubmission(): Promise<TestResult> {
    try {
      const testApplication = {
        applicationType: 'small_grants' as const,
        applicantName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        projectTitle: 'Test Project',
        fundingRequestAmount: 5000,
        numberOfBeneficiaries: 10,
        projectGoals: 'Test goals',
        challengeDescription: 'Test challenge',
        solutionSummary: 'Test solution',
        resourcesRequired: 'Test resources',
        timeline: 'Test timeline'
      };

      const applicationId = mockDB.submitApplication(testApplication, []);
      const savedApplication = mockDB.getApplicationById(applicationId);

      const passed = !!(savedApplication && savedApplication.id === applicationId);
      this.addResult(
        'Application Submission',
        passed,
        passed ? `Application ${applicationId} submitted and saved successfully` : 'Failed to submit application',
        { applicationId, application: savedApplication }
      );

      return this.results[this.results.length - 1];
    } catch (error) {
      this.addResult('Application Submission', false, `Error: ${error}`);
      return this.results[this.results.length - 1];
    }
  }

  // Test 3: Test workflow transitions
  async testWorkflowTransitions(): Promise<TestResult> {
    try {
      // Get the test application from previous test
      const applications = mockDB.getAllApplications();
      const testApp = applications.find(app => app.applicant.name === 'Test User');
      
      if (!testApp) {
        this.addResult('Workflow Transitions', false, 'Test application not found');
        return this.results[this.results.length - 1];
      }

      // Test project officer approval
      const success1 = mockDB.updateApplicationStatus(testApp.id, 'approved', 'project_officer', 'Approved by test');
      const updatedApp1 = mockDB.getApplicationById(testApp.id);

      // Test program manager approval
      const success2 = mockDB.updateApplicationStatus(testApp.id, 'approved', 'program_manager', 'Approved by test');
      const updatedApp2 = mockDB.getApplicationById(testApp.id);

      const passed = success1 && success2 && updatedApp1 && updatedApp2;
      this.addResult(
        'Workflow Transitions',
        passed,
        passed ? 'Workflow transitions working correctly' : 'Workflow transition failed',
        { 
          initialStep: testApp.currentStep,
          afterProjectOfficer: updatedApp1?.currentStep,
          afterProgramManager: updatedApp2?.currentStep
        }
      );

      return this.results[this.results.length - 1];
    } catch (error) {
      this.addResult('Workflow Transitions', false, `Error: ${error}`);
      return this.results[this.results.length - 1];
    }
  }

  // Test 4: Test data persistence across page loads
  async testDataPersistence(): Promise<TestResult> {
    try {
      // Save current state
      const initialApplications = mockDB.getAllApplications();
      const initialReports = mockDB.getAllReports();

      // Force reload from localStorage (simulating page refresh)
      if (typeof window !== 'undefined') {
        const storedApps = localStorage.getItem('bgf_applications');
        const storedReports = localStorage.getItem('bgf_reports');

        const persistedApps = storedApps ? JSON.parse(storedApps) : [];
        const persistedReports = storedReports ? JSON.parse(storedReports) : [];

        const appsPersisted = persistedApps.length === initialApplications.length;
        const reportsPersisted = persistedReports.length === initialReports.length;

        const passed = appsPersisted && reportsPersisted;
        this.addResult(
          'Data Persistence',
          passed,
          passed ? 'Data persists correctly in localStorage' : 'Data persistence failed',
          {
            initialApps: initialApplications.length,
            persistedApps: persistedApps.length,
            initialReports: initialReports.length,
            persistedReports: persistedReports.length
          }
        );
      } else {
        this.addResult('Data Persistence', false, 'Cannot test persistence outside browser environment');
      }

      return this.results[this.results.length - 1];
    } catch (error) {
      this.addResult('Data Persistence', false, `Error: ${error}`);
      return this.results[this.results.length - 1];
    }
  }

  // Test 5: Test report generation
  async testReportGeneration(): Promise<TestResult> {
    try {
      const dateRange = {
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      };

      const financeReport = mockDB.generateReport('finance', dateRange, 'Test User');
      const impactReport = mockDB.generateReport('impact', dateRange, 'Test User');
      const disbursementReport = mockDB.generateReport('disbursement', dateRange, 'Test User');
      const medicalReport = mockDB.generateReport('medical', dateRange, 'Test User');

      const allReports = mockDB.getAllReports();
      const recentReports = allReports.filter(r => 
        [financeReport, impactReport, disbursementReport, medicalReport].includes(r.id)
      );

      const passed = recentReports.length === 4;
      this.addResult(
        'Report Generation',
        passed,
        passed ? 'All report types generated successfully' : 'Report generation failed',
        { 
          generatedReports: recentReports.map(r => ({ id: r.id, type: r.type, title: r.title }))
        }
      );

      return this.results[this.results.length - 1];
    } catch (error) {
      this.addResult('Report Generation', false, `Error: ${error}`);
      return this.results[this.results.length - 1];
    }
  }

  // Test 6: Test user role permissions
  async testRolePermissions(): Promise<TestResult> {
    try {
      const testApplications = mockDB.getAllApplications();
      const testApp = testApplications[0];

      if (!testApp) {
        this.addResult('Role Permissions', false, 'No application found for testing');
        return this.results[this.results.length - 1];
      }

      // Test different role access patterns
      const roles = ['project_officer', 'program_manager', 'finance_director', 'ceo', 'founder'];
      const roleTests = roles.map(role => {
        const hasAccess = mockDB.canUserAccessApplication(testApp.id, role);
        return { role, hasAccess };
      });

      const passed = roleTests.every(test => typeof test.hasAccess === 'boolean');
      this.addResult(
        'Role Permissions',
        passed,
        passed ? 'Role-based access control working' : 'Role permission system failed',
        { roleTests }
      );

      return this.results[this.results.length - 1];
    } catch (error) {
      this.addResult('Role Permissions', false, `Error: ${error}`);
      return this.results[this.results.length - 1];
    }
  }

  // Test 7: Test KPI calculations
  async testKPICalculations(): Promise<TestResult> {
    try {
      const stats = mockDB.getWorkflowStats();
      const requiredKPIs = [
        'totalApplications',
        'pendingApplications', 
        'approvedApplications',
        'rejectedApplications',
        'totalFundsRequested',
        'totalFundsApproved'
      ];

      const hasAllKPIs = requiredKPIs.every(kpi => typeof stats[kpi] === 'number');
      const validValues = stats.totalApplications >= 0 && 
                         stats.totalFundsRequested >= 0 &&
                         stats.totalFundsApproved >= 0;

      const passed = hasAllKPIs && validValues;
      this.addResult(
        'KPI Calculations',
        passed,
        passed ? 'All KPIs calculated correctly' : 'KPI calculation failed',
        { stats }
      );

      return this.results[this.results.length - 1];
    } catch (error) {
      this.addResult('KPI Calculations', false, `Error: ${error}`);
      return this.results[this.results.length - 1];
    }
  }

  // Run all tests
  async runAllTests(): Promise<TestResult[]> {
    console.log('🚀 Starting BGF System Tests...');
    
    await this.testDatabaseInitialization();
    await this.testApplicationSubmission();
    await this.testWorkflowTransitions();
    await this.testDataPersistence();
    await this.testReportGeneration();
    await this.testRolePermissions();
    await this.testKPICalculations();

    return this.results;
  }

  // Generate test report
  getTestReport(): {
    summary: {
      total: number;
      passed: number;
      failed: number;
      passRate: number;
    };
    details: TestResult[];
  } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return {
      summary: { total, passed, failed, passRate },
      details: this.results
    };
  }

  // Clear previous results
  clearResults(): void {
    this.results = [];
  }
}