'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Users,
  BarChart3,
  Bell,
  Calendar,
  TrendingUp,
  UserCheck,
  Building,
  Heart,
  Award
} from 'lucide-react';
import WorkflowManager from '@/components/workflow/WorkflowManager';
import { User } from '@/types';
import { mockDB } from '@/utils/mockDatabase';

interface RoleBasedDashboardProps {
  user: User;
}

interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  totalDisbursed: number;
  beneficiaries: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ user }) => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'dashboard' | 'workflow' | 'applications'>('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    totalDisbursed: 245600,
    beneficiaries: 0
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load stats and applications
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get real statistics from database
        const stats = await mockDB.getWorkflowStats();
        setDashboardStats({
          totalApplications: stats.total,
          pendingReview: stats.pending,
          approved: stats.approved,
          rejected: stats.rejected,
          totalDisbursed: 245600, // This would come from actual disbursement records
          beneficiaries: stats.approved // Each approved application = 1 beneficiary for demo
        });

        // Get applications based on user role
        const apps = user.role === 'applicant' 
          ? await mockDB.getApplicationsByApplicant(user.email)
          : await mockDB.getApplicationsForRole(user.role, user.email);
        
        setApplications(apps);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.role, user.email]);


  const handleApplicationUpdate = (applicationId: string, action: string, comment?: string) => {
    console.log('Application updated:', applicationId, action, comment);
    // Handle application workflow updates
  };

  const getQuickActions = (): QuickAction[] => {
    switch (user.role) {
      case 'applicant':
        return [
          {
            title: 'New Application',
            description: 'Submit a new aid application',
            icon: FileText,
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => router.push('/applications/new')
          },
          {
            title: 'Track Applications',
            description: 'View your application status',
            icon: Clock,
            color: 'bg-green-600 hover:bg-green-700',
            action: () => router.push('/applications')
          },
          {
            title: 'Update Profile',
            description: 'Manage your account details',
            icon: UserCheck,
            color: 'bg-purple-600 hover:bg-purple-700',
            action: () => console.log('Profile update')
          }
        ];

      case 'project_officer':
        return [
          {
            title: 'Review Applications',
            description: 'Process pending applications',
            icon: FileText,
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => setCurrentView('workflow')
          },
          {
            title: 'Generate Reports',
            description: 'Create progress reports',
            icon: BarChart3,
            color: 'bg-green-600 hover:bg-green-700',
            action: () => console.log('Generate reports')
          },
          {
            title: 'Contact Applicants',
            description: 'Follow up on applications',
            icon: Bell,
            color: 'bg-orange-600 hover:bg-orange-700',
            action: () => console.log('Contact applicants')
          }
        ];

      case 'program_manager':
        return [
          {
            title: 'Assign Applications',
            description: 'Distribute applications to officers',
            icon: Users,
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => setCurrentView('workflow')
          },
          {
            title: 'Resource Planning',
            description: 'Manage budget allocation',
            icon: DollarSign,
            color: 'bg-green-600 hover:bg-green-700',
            action: () => console.log('Resource planning')
          },
          {
            title: 'Team Performance',
            description: 'Monitor officer performance',
            icon: TrendingUp,
            color: 'bg-purple-600 hover:bg-purple-700',
            action: () => console.log('Team performance')
          }
        ];

      case 'finance_director':
        return [
          {
            title: 'Financial Review',
            description: 'Approve budget allocations',
            icon: DollarSign,
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => setCurrentView('workflow')
          },
          {
            title: 'Disburse Funds',
            description: 'Release approved funds',
            icon: CheckCircle,
            color: 'bg-green-600 hover:bg-green-700',
            action: () => console.log('Disburse funds')
          },
          {
            title: 'Financial Reports',
            description: 'Generate financial analytics',
            icon: BarChart3,
            color: 'bg-purple-600 hover:bg-purple-700',
            action: () => console.log('Financial reports')
          }
        ];

      case 'hospital_director':
        return [
          {
            title: 'Medical Assessments',
            description: 'Review medical applications',
            icon: Heart,
            color: 'bg-red-600 hover:bg-red-700',
            action: () => setCurrentView('workflow')
          },
          {
            title: 'Facility Booking',
            description: 'Schedule medical appointments',
            icon: Calendar,
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => console.log('Facility booking')
          },
          {
            title: 'Medical Reports',
            description: 'Track patient outcomes',
            icon: BarChart3,
            color: 'bg-green-600 hover:bg-green-700',
            action: () => console.log('Medical reports')
          }
        ];

      case 'executive_director':
      case 'ceo':
        return [
          {
            title: 'Executive Review',
            description: 'Review high-value applications',
            icon: Award,
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => setCurrentView('workflow')
          },
          {
            title: 'Strategic Overview',
            description: 'View organizational metrics',
            icon: BarChart3,
            color: 'bg-green-600 hover:bg-green-700',
            action: () => console.log('Strategic overview')
          },
          {
            title: 'Impact Assessment',
            description: 'Evaluate program effectiveness',
            icon: TrendingUp,
            color: 'bg-purple-600 hover:bg-purple-700',
            action: () => console.log('Impact assessment')
          }
        ];

      case 'founder':
        return [
          {
            title: 'Founders Review',
            description: 'Final approval authority',
            icon: Award,
            color: 'bg-gold-600 hover:bg-gold-700',
            action: () => setCurrentView('workflow')
          },
          {
            title: 'Vision & Strategy',
            description: 'Guide organizational direction',
            icon: Building,
            color: 'bg-indigo-600 hover:bg-indigo-700',
            action: () => console.log('Vision & strategy')
          },
          {
            title: 'Impact Stories',
            description: 'Review success stories',
            icon: Heart,
            color: 'bg-pink-600 hover:bg-pink-700',
            action: () => console.log('Impact stories')
          }
        ];

      default:
        return [];
    }
  };

  const getWelcomeMessage = () => {
    const roleName = user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';
    
    return `Good ${timeOfDay}, ${user.first_name}! Welcome to your ${roleName} dashboard.`;
  };

  const getStatsForRole = () => {
    const baseStats = [
      { label: 'Total Applications', value: dashboardStats.totalApplications, icon: FileText, color: 'text-blue-600' },
      { label: 'Pending Review', value: dashboardStats.pendingReview, icon: Clock, color: 'text-yellow-600' },
      { label: 'Approved', value: dashboardStats.approved, icon: CheckCircle, color: 'text-green-600' },
      { label: 'Total Disbursed', value: `$${dashboardStats.totalDisbursed.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600' },
    ];

    // Customize stats based on role
    switch (user.role) {
      case 'applicant':
        return [
          { label: 'My Applications', value: 3, icon: FileText, color: 'text-blue-600' },
          { label: 'Approved', value: 1, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Pending', value: 2, icon: Clock, color: 'text-yellow-600' },
          { label: 'Total Received', value: '$5,000', icon: DollarSign, color: 'text-purple-600' },
        ];
      
      case 'finance_director':
        return [
          ...baseStats,
          { label: 'Beneficiaries', value: dashboardStats.beneficiaries, icon: Users, color: 'text-indigo-600' },
        ];
      
      default:
        return baseStats;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'workflow') {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>
        </div>
        <WorkflowManager
          userRole={user.role}
          applications={applications}
          onUpdateApplication={handleApplicationUpdate}
          userEmail={user.email}
        />
      </div>
    );
  }


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {getWelcomeMessage()}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your work today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getStatsForRole().map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getQuickActions().map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-6 rounded-lg text-left transition-colors group`}
            >
              <action.icon className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                icon: FileText,
                color: 'text-blue-600',
                title: 'New application submitted',
                description: 'Community Water Project - John Mukamuri',
                time: '2 hours ago'
              },
              {
                icon: CheckCircle,
                color: 'text-green-600',
                title: 'Application approved',
                description: 'High School Scholarship - Grace Moyo',
                time: '4 hours ago'
              },
              {
                icon: DollarSign,
                color: 'text-purple-600',
                title: 'Funds disbursed',
                description: '$2,500 transferred to beneficiary',
                time: '1 day ago'
              },
              {
                icon: Bell,
                color: 'text-orange-600',
                title: 'Document requested',
                description: 'Additional documentation needed for Medical Aid application',
                time: '2 days ago'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <activity.icon className={`h-5 w-5 mt-1 ${activity.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role-specific additional content */}
      {user.role === 'applicant' && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-800 mb-4">
            Our team is here to help you through the application process. Contact us if you have questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <span className="text-blue-700">📧 info@bridginggap.org</span>
            <span className="text-blue-700">📞 +263 123 456 789</span>
          </div>
        </div>
      )}

      {(user.role === 'ceo' || user.role === 'founder') && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-2">BGF Impact Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-gray-600">Lives Transformed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">$245K</div>
              <div className="text-sm text-gray-600">Total Impact</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleBasedDashboard;