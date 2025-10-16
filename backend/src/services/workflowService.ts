import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { ApplicationStatus, UserRole, WorkflowAction } from '../types';

// Define workflow transitions
const workflowTransitions: Record<ApplicationStatus, Record<string, ApplicationStatus>> = {
  new_submission: {
    assign: 'po_review',
    reject: 'rejected'
  },
  po_review: {
    approve: 'manager_review',
    reject: 'rejected',
    request_edit: 'edit_requested'
  },
  manager_review: {
    approve: 'finance_review',
    reject: 'rejected',
    request_edit: 'edit_requested'
  },
  finance_review: {
    approve: 'hospital_review',
    reject: 'rejected',
    request_edit: 'edit_requested'
  },
  hospital_review: {
    approve: 'executive_review',
    reject: 'rejected',
    request_edit: 'edit_requested'
  },
  executive_review: {
    approve: 'ceo_review',
    reject: 'rejected',
    request_edit: 'edit_requested'
  },
  ceo_review: {
    approve: 'founder_review',
    reject: 'rejected',
    request_edit: 'edit_requested'
  },
  founder_review: {
    approve: 'approved',
    reject: 'rejected',
    request_edit: 'edit_requested'
  },
  edit_requested: {
    resubmit: 'po_review'
  },
  approved: {
    disburse: 'disbursed'
  },
  disbursed: {
    complete: 'completed'
  },
  rejected: {},
  completed: {}
};

// Define role permissions for each status
const rolePermissions: Record<ApplicationStatus, UserRole[]> = {
  new_submission: ['program_manager', 'admin'],
  po_review: ['project_officer', 'admin'],
  manager_review: ['program_manager', 'admin'],
  finance_review: ['finance_director', 'admin'],
  hospital_review: ['hospital_director', 'admin'],
  executive_review: ['executive_director', 'admin'],
  ceo_review: ['ceo', 'admin'],
  founder_review: ['founder', 'admin'],
  edit_requested: ['applicant', 'admin'],
  approved: ['finance_director', 'admin'],
  disbursed: ['finance_director', 'admin'],
  rejected: [],
  completed: []
};

/**
 * Execute a workflow action on an application
 */
export const executeWorkflowAction = async (
  applicationId: string,
  action: WorkflowAction,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    // Get current application status
    const appResult = await query(
      'SELECT * FROM applications WHERE id = $1',
      [applicationId]
    );

    if (appResult.rows.length === 0) {
      return {
        success: false,
        message: 'Application not found'
      };
    }

    const application = appResult.rows[0];
    const currentStatus = application.status as ApplicationStatus;

    // Check if action is valid for current status
    const validActions = workflowTransitions[currentStatus];
    if (!validActions || !validActions[action.action]) {
      return {
        success: false,
        message: `Action "${action.action}" is not valid for status "${currentStatus}"`
      };
    }

    const newStatus = validActions[action.action];

    // Get user role
    const userResult = await query(
      'SELECT role FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    const userRole = userResult.rows[0].role as UserRole;

    // Check permissions
    const allowedRoles = rolePermissions[currentStatus];
    if (!allowedRoles.includes(userRole)) {
      return {
        success: false,
        message: 'Insufficient permissions for this action'
      };
    }

    // For project officer actions, check if application is assigned
    if (currentStatus === 'po_review' && userRole === 'project_officer') {
      if (!application.assigned_po_id || application.assigned_po_id !== userId) {
        return {
          success: false,
          message: 'Application is not assigned to you'
        };
      }
    }

    // Update application status
    const updateFields: string[] = ['status = $1'];
    const updateValues: any[] = [newStatus];
    let paramIndex = 2;

    // Handle assignment action
    if (action.action === 'assign' && action.assigned_to) {
      updateFields.push(`assigned_po_id = $${paramIndex++}`);
      updateValues.push(action.assigned_to);
    }

    // Add comments if provided
    if (action.comments) {
      const commentField = getCommentFieldForStatus(currentStatus);
      if (commentField) {
        updateFields.push(`${commentField} = $${paramIndex++}`);
        updateValues.push(action.comments);
      }
    }

    // Add review timestamp
    const reviewField = getReviewTimeFieldForStatus(currentStatus);
    if (reviewField) {
      updateFields.push(`${reviewField} = $${paramIndex++}`);
      updateValues.push(new Date());
    }

    // Set completion date for final statuses
    if (['approved', 'rejected', 'completed'].includes(newStatus)) {
      updateFields.push(`completed_at = $${paramIndex++}`);
      updateValues.push(new Date());
    }

    // Set amount approved for approved status
    if (newStatus === 'approved' && !application.amount_approved) {
      updateFields.push(`amount_approved = $${paramIndex++}`);
      updateValues.push(application.amount_requested);
    }

    updateValues.push(applicationId);

    await query(
      `UPDATE applications 
       SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}`,
      updateValues
    );

    // Log the action
    await query(
      `INSERT INTO application_logs (
        id, application_id, user_id, action, old_status, new_status, 
        comments, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        uuidv4(),
        applicationId,
        userId,
        action.action,
        currentStatus,
        newStatus,
        action.comments || null,
        ipAddress || null,
        userAgent || null
      ]
    );

    return {
      success: true,
      message: `Application ${action.action} successful`,
      newStatus
    };

  } catch (error) {
    console.error('Workflow action error:', error);
    return {
      success: false,
      message: 'Internal server error'
    };
  }
};

/**
 * Get comment field name for a given status
 */
const getCommentFieldForStatus = (status: ApplicationStatus): string | null => {
  const mapping: Record<ApplicationStatus, string> = {
    new_submission: 'po_comments',
    po_review: 'po_comments',
    manager_review: 'manager_comments',
    finance_review: 'finance_comments',
    hospital_review: 'hospital_comments',
    executive_review: 'executive_comments',
    ceo_review: 'ceo_comments',
    founder_review: 'founder_comments',
    edit_requested: 'po_comments',
    approved: 'founder_comments',
    disbursed: 'finance_comments',
    rejected: 'po_comments',
    completed: 'finance_comments'
  };

  return mapping[status] || null;
};

/**
 * Get review timestamp field name for a given status
 */
const getReviewTimeFieldForStatus = (status: ApplicationStatus): string | null => {
  const mapping: Record<ApplicationStatus, string | null> = {
    new_submission: 'po_review_at',
    po_review: 'po_review_at',
    manager_review: 'manager_review_at',
    finance_review: 'finance_review_at',
    hospital_review: 'hospital_review_at',
    executive_review: 'executive_review_at',
    ceo_review: 'ceo_review_at',
    founder_review: 'founder_review_at',
    edit_requested: null,
    approved: null,
    disbursed: null,
    rejected: null,
    completed: null
  };

  return mapping[status] || null;
};

/**
 * Get available actions for an application
 */
export const getAvailableActions = (status: ApplicationStatus, userRole: UserRole) => {
  const allowedRoles = rolePermissions[status];
  if (!allowedRoles.includes(userRole)) {
    return [];
  }

  const validActions = workflowTransitions[status];
  return Object.keys(validActions || {});
};