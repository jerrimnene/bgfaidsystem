'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import {
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Plus,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  User as UserType, 
  Application, 
  DashboardStats, 
  ApplicationStatus,
  UserRole 
} from '@/types';
import { applicationsApi, authApi } from '@/utils/api';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/common/LanguageSelector';

interface DashboardProps {
  user: UserType;
  onCreateApplication?: () => void;
  onEditApplication?: (id: string) => void;
  onViewApplication?: (id: string) => void;
}

// Status colors for different application statuses
const statusColors: Record<ApplicationStatus, string> = {
  'new_submission': '#3B82F6',
  'po_review': '#F59E0B',
  'po_approved': '#10B981',
  'po_rejected': '#EF4444',
  'edit_requested': '#F59E0B',
  'manager_review': '#8B5CF6',
  'manager_approved': '#10B981',
  'manager_rejected': '#EF4444',
  'finance_review': '#06B6D4',
  'hospital_review': '#EC4899',
  'finance_approved': '#10B981',
  'hospital_approved': '#10B981',
  'executive_review': '#7C3AED',
  'executive_approved': '#10B981',
  'executive_rejected': '#EF4444',
  'ceo_review': '#DC2626',
  'ceo_approved': '#10B981',
  'ceo_rejected': '#EF4444',
  'founder_review': '#7C2D12',
  'founder_approved': '#10B981',
  'founder_rejected': '#EF4444',
  'completed': '#059669',
  'cancelled': '#6B7280',
};

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onCreateApplication,
  onEditApplication,
  onViewApplication,
}) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await applicationsApi.getApplicationStats();
      if (statsResponse.success) {
        setStats(statsResponse.data as any);
      }

      // Fetch applications based on role
      const applicationsResponse = await applicationsApi.getApplications({
        limit: 10,
        sort: 'created_at',
        order: 'desc'
      });
      if (applicationsResponse.success) {
        setApplications(applicationsResponse.data || []);
      }

      // Fetch pending applications for reviewers
      if (user.role !== 'applicant') {
        const pendingResponse = await applicationsApi.getPendingApplications();
        if (pendingResponse.success) {
          setPendingApplications(pendingResponse.data || []);
        }
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user.first_name}!`;
  };

  const getRoleSpecificStats = () => {
    if (!stats) return [];

    switch (user.role) {
      case 'applicant':
        return [
          { label: t('dashboard.myApplications'), value: stats.total_applications, icon: FileText, color: 'text-blue-600' },
          { label: t('dashboard.underReview'), value: stats.pending_review, icon: Clock, color: 'text-yellow-600' },
          { label: t('dashboard.approved'), value: stats.approved_applications, icon: CheckCircle, color: 'text-green-600' },
          { label: t('dashboard.totalReceived'), value: `$${stats.total_disbursed.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600' },
        ];
      
      case 'project_officer':
        return [
          { label: 'Assigned to Me', value: pendingApplications.length, icon: FileText, color: 'text-blue-600' },
          { label: 'Pending Review', value: pendingApplications.filter(a => a.status === 'po_review').length, icon: Clock, color: 'text-yellow-600' },
          { label: 'Reviewed Today', value: applications.filter(a => a.po_reviewed_at && new Date(a.po_reviewed_at).toDateString() === new Date().toDateString()).length, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Total Applications', value: stats.total_applications, icon: TrendingUp, color: 'text-purple-600' },
        ];
      
      case 'program_manager':
      case 'finance_director':
      case 'hospital_director':
      case 'executive_director':
      case 'ceo':
      case 'founder':
        return [
          { label: 'Total Applications', value: stats.total_applications, icon: FileText, color: 'text-blue-600' },
          { label: 'Pending Review', value: stats.pending_review, icon: Clock, color: 'text-yellow-600' },
          { label: 'Approved', value: stats.approved_applications, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Total Disbursed', value: `$${stats.total_disbursed.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600' },
        ];
      
      case 'admin':
        return [
          { label: 'Total Applications', value: stats.total_applications, icon: FileText, color: 'text-blue-600' },
          { label: 'Active Users', value: 'N/A', icon: Users, color: 'text-yellow-600' },
          { label: 'Completed', value: stats.approved_applications, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Total Value', value: `$${stats.total_disbursed.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600' },
        ];
      
      default:
        return [];
    }
  };

  const getApplicationsByType = () => {
    if (!stats) return [];
    
    return Object.entries(stats.applications_by_type).map(([type, count]) => ({
      name: type.replace('_', ' ').toUpperCase(),
      value: count,
    }));
  };

  const getApplicationsByStatus = () => {
    if (!stats) return [];
    
    return Object.entries(stats.applications_by_status).map(([status, count]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      value: count,
      fill: statusColors[status as ApplicationStatus] || '#6B7280',
    }));
  };

  const getMonthlyTrends = () => {
    if (!stats) return [];
    
    return stats.monthly_applications.map(item => ({
      month: format(new Date(item.month + '-01'), 'MMM yyyy'),
      applications: item.count,
    }));
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = searchTerm === '' || 
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.applicant_first_name + ' ' + app.applicant_last_name).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatStatus = (status: ApplicationStatus) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status: ApplicationStatus) => {
    return statusColors[status] || '#6B7280';
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'text-red-600 bg-red-100';
      case 3: return 'text-orange-600 bg-orange-100';
      case 2: return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return 'Urgent';
      case 3: return 'High';
      case 2: return 'Medium';
      default: return 'Low';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getGreeting()}</h1>
              <p className="text-gray-600">{t('dashboard.welcome')}</p>
            </div>
            <div className="flex space-x-4">
              <LanguageSelector compact />
              {user.role === 'applicant' && onCreateApplication && (
                <button
                  onClick={onCreateApplication}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('dashboard.newApplication')}</span>
                </button>
              )}
              {user.role === 'admin' && (
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getRoleSpecificStats().map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        {user.role !== 'applicant' && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Applications by Type */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getApplicationsByType()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getApplicationsByType().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Application Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getMonthlyTrends()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pending Applications for Reviewers */}
        {user.role !== 'applicant' && pendingApplications.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Applications Requiring Your Review</h3>
              <p className="text-sm text-gray-600">{pendingApplications.length} applications waiting for your action</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Pending
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingApplications.slice(0, 5).map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{application.application_id}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{application.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.applicant_first_name} {application.applicant_last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {application.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.amount_requested ? 
                          `${application.currency} ${application.amount_requested.toLocaleString()}` : 
                          'N/A'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(application.priority_level)}`}>
                          {getPriorityLabel(application.priority_level)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.floor((Date.now() - new Date(application.updated_at).getTime()) / (1000 * 60 * 60 * 24))} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => onViewApplication?.(application.id)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.role === 'applicant' ? 'My Applications' : 'Recent Applications'}
              </h3>
              <div className="flex space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                {/* Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="new_submission">New</option>
                  <option value="po_review">Under Review</option>
                  <option value="completed">Completed</option>
                  <option value="po_rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{application.application_id}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{application.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {application.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: getStatusColor(application.status) }}
                        >
                          {formatStatus(application.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.amount_requested ? 
                          `${application.currency} ${application.amount_requested.toLocaleString()}` : 
                          'N/A'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(application.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onViewApplication?.(application.id)}
                            className="text-primary-600 hover:text-primary-900"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {user.role === 'applicant' && ['new_submission', 'edit_requested'].includes(application.status) && (
                            <button
                              onClick={() => onEditApplication?.(application.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;