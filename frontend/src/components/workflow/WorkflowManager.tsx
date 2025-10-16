'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  FileText, 
  DollarSign,
  MessageSquare,
  ArrowRight,
  XCircle,
  RotateCcw,
  Users
} from 'lucide-react';
import { mockDB } from '@/utils/mockDatabase';

interface Application {
  id: string;
  title: string;
  applicant: string | { name: string; email: string; phone: string };
  type: 'small_grants' | 'high_school_scholarship' | 'excellence_scholarship' | 'medical_assistance';
  amount: number;
  currentStep: WorkflowStep | string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_info' | 'completed';
  submittedDate: string;
  assignedTo?: string;
  comments?: Comment[];
  documents: string[];
  lastUpdated?: string;
  workflow?: any[];
  currentReviewer?: string;
  currentReviewerRole?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  categories?: string[];
  beneficiaries?: number;
}

interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  type: 'approval' | 'rejection' | 'request_info' | 'comment';
}

type WorkflowStep = 
  | 'submitted'
  | 'project_officer_review' 
  | 'program_manager_review'
  | 'finance_review'
  | 'hospital_review'
  | 'executive_review'
  | 'ceo_review'
  | 'founder_review'
  | 'finance_release'
  | 'hospital_acceptance'
  | 'funds_disbursed'
  | 'me_tracking';

interface WorkflowManagerProps {
  userRole: string;
  applications: Application[];
  onUpdateApplication: (applicationId: string, action: string, comment?: string) => void;
  userEmail?: string;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  userRole,
  applications,
  onUpdateApplication,
  userEmail
}) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [projectOfficers, setProjectOfficers] = useState<any[]>([]);

  useEffect(() => {
    // Load project officers for assignment
    if (userRole === 'program_manager') {
      const loadProjectOfficers = async () => {
        try {
          const officers = await mockDB.getProjectOfficers();
          setProjectOfficers(officers);
        } catch (error) {
          console.error('Error loading project officers:', error);
        }
      };
      loadProjectOfficers();
    }
  }, [userRole]);

  const workflowSteps: { [key in WorkflowStep]: { 
    title: string; 
    description: string; 
    role: string; 
    order: number;
  }} = {
    'submitted': { 
      title: 'Application Submitted', 
      description: 'Application received and awaiting initial review',
      role: 'system',
      order: 1
    },
    'project_officer_review': { 
      title: 'Project Officer Review', 
      description: 'Validating application completeness and initial assessment',
      role: 'project_officer',
      order: 2
    },
    'program_manager_review': { 
      title: 'Program Manager Review', 
      description: 'Strategic assessment and resource allocation review',
      role: 'program_manager',
      order: 3
    },
    'finance_review': { 
      title: 'Finance Director Review', 
      description: 'Financial assessment and budget verification',
      role: 'finance_director',
      order: 4
    },
    'hospital_review': { 
      title: 'Hospital Director Review', 
      description: 'Medical assessment and facility availability',
      role: 'hospital_director',
      order: 4
    },
    'executive_review': { 
      title: 'Executive Director Review', 
      description: 'Executive level assessment and strategic alignment',
      role: 'executive_director',
      order: 5
    },
    'ceo_review': { 
      title: 'CEO Review', 
      description: 'Chief Executive Officer final assessment',
      role: 'ceo',
      order: 6
    },
    'founder_review': { 
      title: 'Founders Review', 
      description: 'Final approval from Mr. and Mrs. Tangire',
      role: 'founder',
      order: 7
    },
    'finance_release': { 
      title: 'Finance Release', 
      description: 'Finance director releases approved funds',
      role: 'finance_director',
      order: 8
    },
    'hospital_acceptance': { 
      title: 'Hospital Acceptance', 
      description: 'Hospital director accepts medical application',
      role: 'hospital_director',
      order: 8
    },
    'funds_disbursed': { 
      title: 'Funds Disbursed', 
      description: 'Funds successfully transferred to beneficiary',
      role: 'system',
      order: 9
    },
    'me_tracking': { 
      title: 'M&E Tracking', 
      description: 'Monitoring and evaluation of impact and outcomes',
      role: 'project_officer',
      order: 10
    }
  };

  const getApplicationsForRole = () => {
    return applications.filter(app => {
      const currentStepInfo = workflowSteps[app.currentStep as WorkflowStep];
      
      // Show applications that need this role's attention
      if (currentStepInfo.role === userRole) {
        return app.status === 'pending' || app.status === 'requires_info';
      }
      
      // Show all applications for admin, executives, and founders
      if (userRole === 'admin' || userRole === 'ceo' || userRole === 'founder' || userRole === 'executive_director') {
        return true;
      }
      
      // Show applications for senior roles to approve if needed
      const hierarchyMap = {
        'project_officer': 1,
        'program_manager': 2,
        'finance_director': 3,
        'hospital_director': 3,
        'executive_director': 4,
        'ceo': 5,
        'founder': 6
      };
      
      const currentRoleLevel = hierarchyMap[currentStepInfo.role as keyof typeof hierarchyMap] || 0;
      const userRoleLevel = hierarchyMap[userRole as keyof typeof hierarchyMap] || 0;
      
      // Allow higher-level roles to see and approve applications
      if (userRoleLevel > currentRoleLevel && (app.status === 'pending' || app.status === 'requires_info')) {
        return true;
      }
      
      return false;
    });
  };

  const canTakeAction = (application: Application) => {
    const currentStepInfo = workflowSteps[application.currentStep as WorkflowStep];
    
    // Allow exact role match
    if (currentStepInfo.role === userRole && 
        (application.status === 'pending' || application.status === 'requires_info')) {
      return true;
    }
    
    // Allow admin, executives, and founders to approve any application
    if ((userRole === 'admin' || userRole === 'ceo' || userRole === 'founder' || userRole === 'executive_director') && 
        (application.status === 'pending' || application.status === 'requires_info')) {
      return true;
    }
    
    // Allow hierarchical approvals - higher roles can approve lower-level steps
    const hierarchyMap = {
      'project_officer': 1,
      'program_manager': 2, 
      'finance_director': 3,
      'hospital_director': 3,
      'executive_director': 4,
      'ceo': 5,
      'founder': 6
    };
    
    const currentRoleLevel = hierarchyMap[currentStepInfo.role as keyof typeof hierarchyMap] || 0;
    const userRoleLevel = hierarchyMap[userRole as keyof typeof hierarchyMap] || 0;
    
    return userRoleLevel > currentRoleLevel && 
           (application.status === 'pending' || application.status === 'requires_info');
  };

  const handleAction = (action: string) => {
    if (!selectedApplication) return;
    
    if (action === 'assign') {
      setShowAssignModal(true);
    } else if (action === 'approve' || action === 'reject' || action === 'request_info') {
      setPendingAction(action);
      setShowCommentModal(true);
    } else {
      onUpdateApplication(selectedApplication.id, action);
      setSelectedApplication(null);
    }
  };

  const handleAssignment = async () => {
    if (!selectedApplication || !selectedOfficer || !userEmail) return;
    
    try {
      // Use the assignment method from mockDB
      const success = await mockDB.assignApplicationToUser(
        selectedApplication.id,
        selectedOfficer,
        userEmail,
        actionComment || 'Assigned by program manager'
      );
      
      if (success) {
        // Close modal and refresh
        setShowAssignModal(false);
        setSelectedOfficer('');
        setActionComment('');
        setSelectedApplication(null);
        // Trigger a refresh
        window.location.reload();
      } else {
        console.error('Failed to assign application');
      }
    } catch (error) {
      console.error('Error assigning application:', error);
    }
  };

  const submitAction = () => {
    if (!selectedApplication || !pendingAction) return;
    
    onUpdateApplication(selectedApplication.id, pendingAction, actionComment);
    setShowCommentModal(false);
    setActionComment('');
    setPendingAction('');
    setSelectedApplication(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'requires_info':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStepStatus = (application: Application, step: WorkflowStep) => {
    const appStepOrder = workflowSteps[application.currentStep as WorkflowStep].order;
    const stepOrder = workflowSteps[step].order;
    
    if (stepOrder < appStepOrder) return 'completed';
    if (stepOrder === appStepOrder) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {userRole === 'admin' ? 'All Applications' : 'Applications for Review'}
        </h1>
        <p className="text-gray-600">
          {userRole === 'admin' 
            ? 'System overview of all applications and their workflow status'
            : `Applications requiring your attention as ${userRole.replace('_', ' ')}`
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
            </div>
            
            <div className="divide-y">
              {getApplicationsForRole().map((application) => (
                <div
                  key={application.id}
                  className={`p-6 cursor-pointer transition-colors ${
                    selectedApplication?.id === application.id 
                      ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(application.status)}
                        <h3 className="font-medium text-gray-900">{application.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          application.status === 'requires_info' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {application.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Applicant: <span className="font-medium">
                          {typeof application.applicant === 'string' 
                            ? application.applicant 
                            : application.applicant?.name || 'N/A'}
                        </span></div>
                        <div>Type: <span className="font-medium">{application.type.replace('_', ' ')}</span></div>
                        <div>Amount: <span className="font-medium">${application.amount.toLocaleString()}</span></div>
                        <div>Current Step: <span className="font-medium">{workflowSteps[application.currentStep as WorkflowStep]?.title || application.currentStep}</span></div>
                        <div>Submitted: <span className="font-medium">{new Date(application.submittedDate).toLocaleDateString()}</span></div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {canTakeAction(application) && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Action Required
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {getApplicationsForRole().length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications requiring your attention at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="space-y-6">
          {selectedApplication ? (
            <>
              {/* Application Details Card */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedApplication.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">by {
                      typeof selectedApplication.applicant === 'string' 
                        ? selectedApplication.applicant 
                        : selectedApplication.applicant?.name || 'N/A'
                    }</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium">{selectedApplication.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <p className="font-medium">${selectedApplication.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-medium capitalize">{selectedApplication.status.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <p className="font-medium">{new Date(selectedApplication.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Documents:</span>
                    <div className="mt-2 space-y-1">
                      {selectedApplication.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Progress */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Workflow Progress</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {Object.entries(workflowSteps)
                      .filter(([step]) => {
                        // Show relevant steps based on application type
                        if (selectedApplication.type === 'medical_assistance') {
                          return step !== 'finance_review';
                        } else {
                          return step !== 'hospital_review';
                        }
                      })
                      .sort(([, a], [, b]) => a.order - b.order)
                      .map(([step, info]) => {
                        const status = getStepStatus(selectedApplication, step as WorkflowStep);
                        return (
                          <div key={step} className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              status === 'completed' ? 'bg-green-100 text-green-600' :
                              status === 'current' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {status === 'completed' ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : status === 'current' ? (
                                <Clock className="h-5 w-5" />
                              ) : (
                                <span className="text-xs font-medium">{info.order}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${
                                status === 'current' ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {info.title}
                              </p>
                              <p className="text-sm text-gray-600">{info.description}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {canTakeAction(selectedApplication) && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Take Action</h3>
                  </div>
                  
                  <div className="p-6 space-y-3">
                    {userRole === 'program_manager' && selectedApplication.currentStep === 'program_manager_review' ? (
                      <>
                        <button
                          onClick={() => handleAction('assign')}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Users className="h-4 w-4" />
                          <span>Assign to Project Officer</span>
                        </button>
                        
                        <button
                          onClick={() => handleAction('request_info')}
                          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>Request More Information</span>
                        </button>
                        
                        <button
                          onClick={() => handleAction('reject')}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAction('approve')}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        
                        <button
                          onClick={() => handleAction('request_info')}
                          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>Request More Information</span>
                        </button>
                        
                        <button
                          onClick={() => handleAction('reject')}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Comments History */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Comments & History</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {(selectedApplication.comments || []).map((comment) => (
                      <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{comment.role}</p>
                        <p className="text-gray-900">{comment.content}</p>
                      </div>
                    ))}
                    
                    {(!selectedApplication.comments || selectedApplication.comments.length === 0) && (
                      <p className="text-gray-600 text-center py-4">No comments yet</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select an application to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {pendingAction === 'approve' ? 'Approve Application' :
                 pendingAction === 'reject' ? 'Reject Application' :
                 'Request More Information'}
              </h3>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (required)
              </label>
              <textarea
                rows={4}
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please provide your comments or reasoning..."
                required
              />
            </div>
            
            <div className="p-6 border-t flex space-x-3">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setActionComment('');
                  setPendingAction('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={!actionComment.trim()}
                className={`flex-1 py-2 px-4 rounded-lg text-white ${
                  pendingAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  pendingAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-yellow-600 hover:bg-yellow-700'
                } disabled:bg-gray-400`}
              >
                {pendingAction === 'approve' ? 'Approve' :
                 pendingAction === 'reject' ? 'Reject' :
                 'Request Info'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Assign Application to Project Officer
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Project Officer
                </label>
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose a project officer...</option>
                  {projectOfficers.map((officer) => (
                    <option key={officer.id} value={officer.email}>
                      {officer.first_name} {officer.last_name} ({officer.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about this assignment..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t flex space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedOfficer('');
                  setActionComment('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignment}
                disabled={!selectedOfficer}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:bg-gray-400"
              >
                Assign Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManager;
