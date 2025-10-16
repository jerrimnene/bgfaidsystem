'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare, 
  Download,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Application, User as UserType, ApplicationStatus, WorkflowStep } from '@/types';
import { applicationsApi } from '@/utils/api';

interface ReviewerDashboardProps {
  user: UserType;
  onViewApplication: (id: string) => void;
}

interface ReviewAction {
  action: 'approve' | 'reject' | 'request_edit';
  comments: string;
  next_step?: string;
}

const ReviewerDashboard: React.FC<ReviewerDashboardProps> = ({
  user,
  onViewApplication,
}) => {
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [recentlyReviewed, setRecentlyReviewed] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewAction, setReviewAction] = useState<ReviewAction>({
    action: 'approve',
    comments: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviewerData();
  }, [user.role]);

  const fetchReviewerData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending applications for this reviewer
      const pendingResponse = await applicationsApi.getPendingApplications();
      if (pendingResponse.success) {
        setPendingApplications(pendingResponse.data || []);
      }

      // Fetch recently reviewed applications
      const recentResponse = await applicationsApi.getApplications({
        reviewed_by: user.id,
        limit: 10,
        sort: 'updated_at',
        order: 'desc'
      });
      if (recentResponse.success) {
        setRecentlyReviewed(recentResponse.data || []);
      }
    } catch (error) {
      toast.error('Failed to load reviewer data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedApplication) return;

    try {
      setSubmitting(true);
      
      const response = await applicationsApi.reviewApplication(selectedApplication.id, {
        action: reviewAction.action,
        comments: reviewAction.comments,
        next_step: reviewAction.next_step
      });

      if (response.success) {
        toast.success(`Application ${reviewAction.action}d successfully`);
        setReviewModalOpen(false);
        setSelectedApplication(null);
        setReviewAction({ action: 'approve', comments: '' });
        fetchReviewerData(); // Refresh data
      } else {
        toast.error(response.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = (application: Application) => {
    setSelectedApplication(application);
    setReviewAction({ action: 'approve', comments: '' });
    setReviewModalOpen(true);
  };

  const getRoleSpecificStatus = (): ApplicationStatus[] => {
    switch (user.role) {
      case 'project_officer':
        return ['po_review'];
      case 'program_manager':
        return ['manager_review'];
      case 'finance_director':
        return ['finance_review'];
      case 'hospital_director':
        return ['hospital_review'];
      case 'executive_director':
        return ['executive_review'];
      case 'ceo':
        return ['ceo_review'];
      case 'founder':
        return ['founder_review'];
      default:
        return [];
    }
  };

  const getNextWorkflowStep = (currentStatus: ApplicationStatus, action: 'approve' | 'reject'): string => {
    if (action === 'reject') {
      return `${user.role?.split('_')[0]}_rejected`;
    }

    const statusMap: Record<ApplicationStatus, string> = {
      'po_review': 'manager_review',
      'manager_review': 'finance_review',
      'finance_review': 'executive_review',
      'hospital_review': 'executive_review',
      'executive_review': 'ceo_review',
      'ceo_review': 'founder_review',
      'founder_review': 'completed',
      'new_submission': 'po_review',
      'edit_requested': 'po_review',
      'po_approved': 'manager_review',
      'po_rejected': 'cancelled',
      'manager_approved': 'finance_review',
      'manager_rejected': 'cancelled',
      'finance_approved': 'executive_review',
      'hospital_approved': 'executive_review',
      'executive_approved': 'ceo_review',
      'executive_rejected': 'cancelled',
      'ceo_approved': 'founder_review',
      'ceo_rejected': 'cancelled',
      'founder_approved': 'completed',
      'founder_rejected': 'cancelled',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };

    return statusMap[currentStatus] || currentStatus;
  };

  const filteredPendingApplications = pendingApplications.filter(app => {
    const roleStatuses = getRoleSpecificStatus();
    const matchesRole = roleStatuses.includes(app.status);
    const matchesFilter = filter === 'all' || app.type === filter;
    const matchesSearch = searchTerm === '' || 
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.applicant_first_name + ' ' + app.applicant_last_name).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesFilter && matchesSearch;
  });

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

  const formatStatus = (status: ApplicationStatus) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getDaysWaiting = (date: string) => {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
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
              <h1 className="text-2xl font-bold text-gray-900">Review Dashboard</h1>
              <p className="text-gray-600">
                {filteredPendingApplications.length} applications pending your review
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-blue-600 mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredPendingApplications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-4">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent (&gt;7 days)</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredPendingApplications.filter(app => getDaysWaiting(app.updated_at) > 7).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-green-600 mr-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {recentlyReviewed.filter(app => 
                    new Date(app.updated_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-purple-600 mr-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${filteredPendingApplications.reduce((sum, app) => sum + (app.amount_requested || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Applications Requiring Review</h3>
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
                  <option value="all">All Types</option>
                  <option value="grant">Grant</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="medical_assistance">Medical Aid</option>
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
                    Days Waiting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPendingApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No applications pending your review
                    </td>
                  </tr>
                ) : (
                  filteredPendingApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{application.application_id}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{application.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.applicant_first_name} {application.applicant_last_name}
                            </div>
                            <div className="text-sm text-gray-500">{application.applicant_email}</div>
                          </div>
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
                        <div className="flex items-center">
                          {getDaysWaiting(application.updated_at) > 7 && (
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          {getDaysWaiting(application.updated_at)} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onViewApplication(application.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openReviewModal(application)}
                            className="bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 text-xs flex items-center space-x-1"
                          >
                            <span>Review</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Reviewed Applications */}
        {recentlyReviewed.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recently Reviewed</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentlyReviewed.slice(0, 5).map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {application.application_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">
                        {application.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {formatStatus(application.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(application.updated_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => onViewApplication(application.id)}
                          className="text-primary-600 hover:text-primary-900"
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
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Review Application: {selectedApplication.application_id}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="approve"
                      checked={reviewAction.action === 'approve'}
                      onChange={(e) => setReviewAction({
                        ...reviewAction, 
                        action: e.target.value as 'approve' | 'reject' | 'request_edit',
                        next_step: getNextWorkflowStep(selectedApplication.status, 'approve')
                      })}
                      className="mr-2"
                    />
                    Approve
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="reject"
                      checked={reviewAction.action === 'reject'}
                      onChange={(e) => setReviewAction({
                        ...reviewAction, 
                        action: e.target.value as 'approve' | 'reject' | 'request_edit',
                        next_step: getNextWorkflowStep(selectedApplication.status, 'reject')
                      })}
                      className="mr-2"
                    />
                    Reject
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="request_edit"
                      checked={reviewAction.action === 'request_edit'}
                      onChange={(e) => setReviewAction({
                        ...reviewAction, 
                        action: e.target.value as 'approve' | 'reject' | 'request_edit',
                        next_step: 'edit_requested'
                      })}
                      className="mr-2"
                    />
                    Request Changes
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                  Comments {reviewAction.action === 'reject' || reviewAction.action === 'request_edit' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  value={reviewAction.comments}
                  onChange={(e) => setReviewAction({...reviewAction, comments: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add your review comments..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setReviewModalOpen(false);
                    setSelectedApplication(null);
                    setReviewAction({ action: 'approve', comments: '' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReviewSubmit}
                  disabled={
                    submitting || 
                    (reviewAction.action !== 'approve' && !reviewAction.comments.trim())
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;