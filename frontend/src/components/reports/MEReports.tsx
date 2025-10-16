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
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Download,
  Calendar,
  Target,
  Award,
  Activity,
  BookOpen,
  Heart,
  Filter,
  Search,
  Eye,
  Printer
} from 'lucide-react';
import { format, subMonths, startOfYear, endOfYear } from 'date-fns';
import { toast } from 'react-hot-toast';
import { User, Application, MEReport, ImpactData } from '@/types';
import { applicationsApi } from '@/utils/api';

interface MEReportsProps {
  user: User;
}

interface MEStats {
  total_applications: number;
  total_disbursed: number;
  beneficiaries_reached: number;
  success_rate: number;
  applications_by_type: Record<string, number>;
  disbursements_by_month: Array<{ month: string; amount: number; count: number }>;
  impact_metrics: {
    scholarships: { students_supported: number; graduation_rate: number };
    medical_aid: { patients_helped: number; lives_saved: number };
    grants: { businesses_supported: number; jobs_created: number };
  };
  regional_distribution: Array<{ region: string; count: number; amount: number }>;
}

const MEReports: React.FC<MEReportsProps> = ({ user }) => {
  const [stats, setStats] = useState<MEStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: format(startOfYear(new Date()), 'yyyy-MM-dd'),
    end: format(endOfYear(new Date()), 'yyyy-MM-dd')
  });
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMEData();
  }, [dateRange, applicationFilter]);

  const fetchMEData = async () => {
    try {
      setLoading(true);
      
      // Mock ME data - would come from dedicated ME API endpoints
      const mockStats: MEStats = {
        total_applications: 450,
        total_disbursed: 2500000,
        beneficiaries_reached: 1250,
        success_rate: 87.5,
        applications_by_type: {
          'scholarship': 180,
          'medical_assistance': 150,
          'grant': 120
        },
        disbursements_by_month: [
          { month: 'Jan 2024', amount: 180000, count: 35 },
          { month: 'Feb 2024', amount: 220000, count: 42 },
          { month: 'Mar 2024', amount: 195000, count: 38 },
          { month: 'Apr 2024', amount: 275000, count: 48 },
          { month: 'May 2024', amount: 310000, count: 55 },
          { month: 'Jun 2024', amount: 285000, count: 51 },
          { month: 'Jul 2024', amount: 320000, count: 58 },
          { month: 'Aug 2024', amount: 295000, count: 52 },
          { month: 'Sep 2024', amount: 250000, count: 45 },
          { month: 'Oct 2024', amount: 165000, count: 28 }
        ],
        impact_metrics: {
          scholarships: { students_supported: 180, graduation_rate: 94.2 },
          medical_aid: { patients_helped: 150, lives_saved: 12 },
          grants: { businesses_supported: 120, jobs_created: 450 }
        },
        regional_distribution: [
          { region: 'Harare', count: 125, amount: 850000 },
          { region: 'Bulawayo', count: 95, amount: 650000 },
          { region: 'Gweru', count: 75, amount: 480000 },
          { region: 'Mutare', count: 65, amount: 420000 },
          { region: 'Masvingo', count: 55, amount: 350000 },
          { region: 'Chinhoyi', count: 35, amount: 250000 }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      toast.error('Failed to load M&E data');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'pdf' | 'excel') => {
    try {
      toast.loading(`Generating ${type.toUpperCase()} report...`);
      
      // Mock report generation
      setTimeout(() => {
        toast.dismiss();
        toast.success(`${type.toUpperCase()} report generated successfully`);
        // In real implementation, this would trigger a download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `BGF_ME_Report_${format(new Date(), 'yyyy-MM-dd')}.${type}`;
        // link.click(); // Uncomment to trigger actual download
      }, 2000);
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-blue-600 mr-4">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_applications.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">↗ 15% from last year</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-green-600 mr-4">
              <DollarSign className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Disbursed</p>
              <p className="text-3xl font-bold text-gray-900">${stats?.total_disbursed.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">↗ 23% from last year</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-purple-600 mr-4">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.beneficiaries_reached.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">↗ 18% from last year</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-orange-600 mr-4">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.success_rate}%</p>
              <p className="text-xs text-green-600 mt-1">↗ 2.3% from last year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Disbursements Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disbursements Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats?.disbursements_by_month || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
              <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Applications by Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(stats?.applications_by_type || {}).map(([type, count]) => ({
                  name: type.replace('_', ' ').toUpperCase(),
                  value: count
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(stats?.applications_by_type || {}).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stats?.regional_distribution || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="count" fill="#3B82F6" name="Applications" />
            <Bar yAxisId="right" dataKey="amount" fill="#10B981" name="Amount ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderImpactAnalysis = () => (
    <div className="space-y-6">
      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Education Impact</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Students Supported</span>
              <span className="font-semibold">{stats?.impact_metrics.scholarships.students_supported}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Graduation Rate</span>
              <span className="font-semibold text-green-600">{stats?.impact_metrics.scholarships.graduation_rate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Heart className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Medical Impact</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Patients Helped</span>
              <span className="font-semibold">{stats?.impact_metrics.medical_aid.patients_helped}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Lives Saved</span>
              <span className="font-semibold text-green-600">{stats?.impact_metrics.medical_aid.lives_saved}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Economic Impact</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Businesses Supported</span>
              <span className="font-semibold">{stats?.impact_metrics.grants.businesses_supported}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Jobs Created</span>
              <span className="font-semibold text-green-600">{stats?.impact_metrics.grants.jobs_created}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Stories</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900">Sarah's Educational Journey</h4>
            <p className="text-sm text-gray-600 mt-1">
              BGF scholarship enabled Sarah to complete her engineering degree. She now works as a civil engineer 
              and has started a mentorship program for young girls in STEM.
            </p>
            <span className="text-xs text-blue-600 mt-2 inline-block">Education Impact</span>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900">Life-Saving Medical Support</h4>
            <p className="text-sm text-gray-600 mt-1">
              BGF's medical assistance program funded critical surgery for 5-year-old Tinashe, 
              giving him a chance at a normal childhood.
            </p>
            <span className="text-xs text-red-600 mt-2 inline-block">Medical Impact</span>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-semibold text-gray-900">Small Business Growth</h4>
            <p className="text-sm text-gray-600 mt-1">
              Maria's small bakery expanded with BGF grant support, now employing 8 people 
              and supplying bread to 3 schools in her community.
            </p>
            <span className="text-xs text-green-600 mt-2 inline-block">Economic Impact</span>
          </div>
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-2xl font-bold text-gray-900">M&E Reports</h1>
              <p className="text-gray-600">Monitoring, evaluation, and impact reporting</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => generateReport('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => generateReport('excel')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Type</label>
              <select
                value={applicationFilter}
                onChange={(e) => setApplicationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="scholarship">Scholarships</option>
                <option value="medical_assistance">Medical Aid</option>
                <option value="grant">Grants</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={fetchMEData}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Overview</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('impact')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'impact'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Impact Analysis</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'impact' && renderImpactAnalysis()}
      </div>
    </div>
  );
};

export default MEReports;