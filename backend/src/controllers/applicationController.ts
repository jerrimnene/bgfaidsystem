import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { Application, ApplicationFilterQuery, ApiResponse, WorkflowAction } from '../types';
import { executeWorkflowAction } from '../services/workflowService';

/**
 * Create a new application
 */
export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const {
      title,
      description,
      type,
      amount_requested,
      personal_info,
      project_details,
      priority_level = 'medium'
    } = req.body;

    // Validation
    if (!title || !description || !type || !personal_info || !project_details) {
      res.status(400).json({
        success: false,
        error: 'Title, description, type, personal_info, and project_details are required'
      } as ApiResponse);
      return;
    }

    // Create application
    const applicationId = uuidv4();
    const result = await query(
      `INSERT INTO applications (
        id, applicant_id, title, description, type, status, 
        amount_requested, priority_level, personal_info, project_details
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        applicationId,
        req.user.id,
        title,
        description,
        type,
        'new_submission',
        amount_requested || null,
        priority_level,
        JSON.stringify(personal_info),
        JSON.stringify(project_details)
      ]
    );

    const newApplication = result.rows[0];

    // Log the creation
    await query(
      `INSERT INTO application_logs (id, application_id, user_id, action, old_status, new_status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), applicationId, req.user.id, 'create', null, 'new_submission']
    );

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: {
        ...newApplication,
        personal_info: JSON.parse(newApplication.personal_info || '{}'),
        project_details: JSON.parse(newApplication.project_details || '{}')
      }
    } as ApiResponse<Application>);

  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get applications with filtering and pagination
 */
export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const {
      page = 1,
      limit = 20,
      sort = 'created_at',
      order = 'desc',
      search,
      status,
      type,
      assigned_po_id,
      applicant_id,
      date_from,
      date_to
    }: ApplicationFilterQuery = req.query as any;

    // Build where clause based on user role and filters
    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Role-based filtering
    switch (req.user.role) {
      case 'applicant':
        whereConditions.push(`a.applicant_id = $${paramIndex++}`);
        queryParams.push(req.user.id);
        break;
      case 'project_officer':
        whereConditions.push(`a.assigned_po_id = $${paramIndex++}`);
        queryParams.push(req.user.id);
        break;
      // Other roles can see all applications
    }

    // Apply filters
    if (status) {
      whereConditions.push(`a.status = $${paramIndex++}`);
      queryParams.push(status);
    }
    if (type) {
      whereConditions.push(`a.type = $${paramIndex++}`);
      queryParams.push(type);
    }
    if (assigned_po_id) {
      whereConditions.push(`a.assigned_po_id = $${paramIndex++}`);
      queryParams.push(assigned_po_id);
    }
    if (applicant_id) {
      whereConditions.push(`a.applicant_id = $${paramIndex++}`);
      queryParams.push(applicant_id);
    }
    if (search) {
      whereConditions.push(`(
        a.title ILIKE $${paramIndex} OR 
        a.description ILIKE $${paramIndex} OR
        u.first_name ILIKE $${paramIndex} OR
        u.last_name ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    if (date_from) {
      whereConditions.push(`a.created_at >= $${paramIndex++}`);
      queryParams.push(date_from);
    }
    if (date_to) {
      whereConditions.push(`a.created_at <= $${paramIndex++}`);
      queryParams.push(date_to);
    }

    const whereClause = whereConditions.length > 0 ? 
      `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM applications a
       JOIN users u ON a.applicant_id = u.id
       ${whereClause}`,
      queryParams
    );

    const total = parseInt(countResult.rows[0].total);
    const offset = (parseInt(page.toString()) - 1) * parseInt(limit.toString());
    
    // Add pagination parameters
    queryParams.push(limit, offset);

    // Get applications
    const applicationsResult = await query(
      `SELECT 
         a.*,
         u.first_name as applicant_first_name,
         u.last_name as applicant_last_name,
         u.email as applicant_email,
         po.first_name as po_first_name,
         po.last_name as po_last_name,
         reviewer.first_name as reviewer_first_name,
         reviewer.last_name as reviewer_last_name
       FROM applications a
       JOIN users u ON a.applicant_id = u.id
       LEFT JOIN users po ON a.assigned_po_id = po.id
       LEFT JOIN users reviewer ON a.current_reviewer_id = reviewer.id
       ${whereClause}
       ORDER BY a.${sort} ${order.toUpperCase()}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      queryParams
    );

    // Parse JSON fields
    const applications = applicationsResult.rows.map(app => ({
      ...app,
      personal_info: JSON.parse(app.personal_info || '{}'),
      project_details: JSON.parse(app.project_details || '{}')
    }));

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
        total,
        pages: Math.ceil(total / parseInt(limit.toString()))
      }
    } as ApiResponse<Application[]>);

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get a single application by ID
 */
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Application ID is required'
      } as ApiResponse);
      return;
    }

    const result = await query(
      `SELECT 
         a.*,
         u.first_name as applicant_first_name,
         u.last_name as applicant_last_name,
         u.email as applicant_email,
         u.phone as applicant_phone,
         po.first_name as po_first_name,
         po.last_name as po_last_name,
         reviewer.first_name as reviewer_first_name,
         reviewer.last_name as reviewer_last_name
       FROM applications a
       JOIN users u ON a.applicant_id = u.id
       LEFT JOIN users po ON a.assigned_po_id = po.id
       LEFT JOIN users reviewer ON a.current_reviewer_id = reviewer.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Application not found'
      } as ApiResponse);
      return;
    }

    const application = result.rows[0];

    res.json({
      success: true,
      data: {
        ...application,
        personal_info: JSON.parse(application.personal_info || '{}'),
        project_details: JSON.parse(application.project_details || '{}')
      }
    } as ApiResponse<Application>);

  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Update an application
 */
export const updateApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const {
      title,
      description,
      amount_requested,
      personal_info,
      project_details,
      priority_level
    } = req.body;

    // Get current application
    const currentApp = await query(
      'SELECT * FROM applications WHERE id = $1',
      [id]
    );

    if (currentApp.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Application not found'
      } as ApiResponse);
      return;
    }

    const application = currentApp.rows[0];

    // Check permissions
    if (req.user.role === 'applicant' && application.applicant_id !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'You can only edit your own applications'
      } as ApiResponse);
      return;
    }

    // Check if application can be edited
    const editableStatuses = ['new_submission', 'edit_requested'];
    if (req.user.role === 'applicant' && !editableStatuses.includes(application.status)) {
      res.status(400).json({
        success: false,
        error: 'Application cannot be edited in its current status'
      } as ApiResponse);
      return;
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`);
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      updateValues.push(description);
    }
    if (amount_requested !== undefined) {
      updateFields.push(`amount_requested = $${paramIndex++}`);
      updateValues.push(amount_requested);
    }
    if (personal_info !== undefined) {
      updateFields.push(`personal_info = $${paramIndex++}`);
      updateValues.push(JSON.stringify(personal_info));
    }
    if (project_details !== undefined) {
      updateFields.push(`project_details = $${paramIndex++}`);
      updateValues.push(JSON.stringify(project_details));
    }
    if (priority_level !== undefined && req.user.role !== 'applicant') {
      updateFields.push(`priority_level = $${paramIndex++}`);
      updateValues.push(priority_level);
    }

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No fields to update'
      } as ApiResponse);
      return;
    }

    updateValues.push(id);
    const result = await query(
      `UPDATE applications 
       SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`,
      updateValues
    );

    const updatedApplication = result.rows[0];

    // Log the update
    await query(
      `INSERT INTO application_logs (id, application_id, user_id, action, old_status, new_status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        uuidv4(),
        id,
        req.user.id,
        'update',
        application.status,
        application.status, // Status doesn't change on update
        JSON.stringify({ updated_fields: updateFields })
      ]
    );

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: {
        ...updatedApplication,
        personal_info: JSON.parse(updatedApplication.personal_info || '{}'),
        project_details: JSON.parse(updatedApplication.project_details || '{}')
      }
    } as ApiResponse<Application>);

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Delete an application
 */
export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { id } = req.params;

    // Get current application
    const currentApp = await query(
      'SELECT * FROM applications WHERE id = $1',
      [id]
    );

    if (currentApp.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Application not found'
      } as ApiResponse);
      return;
    }

    const application = currentApp.rows[0];

    // Check permissions
    if (req.user.role === 'applicant' && application.applicant_id !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'You can only delete your own applications'
      } as ApiResponse);
      return;
    }

    // Only allow deletion of new submissions
    if (application.status !== 'new_submission') {
      res.status(400).json({
        success: false,
        error: 'Only new submissions can be deleted'
      } as ApiResponse);
      return;
    }

    // Delete application
    await query('DELETE FROM applications WHERE id = $1', [id]);

    // Log the deletion
    await query(
      `INSERT INTO application_logs (id, application_id, user_id, action, old_status, new_status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), id, req.user.id, 'delete', application.status, null]
    );

    res.json({
      success: true,
      message: 'Application deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Execute workflow action on application
 */
export const executeAction = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const { action, comments, assigned_to }: WorkflowAction = req.body;

    if (!action) {
      res.status(400).json({
        success: false,
        error: 'Action is required'
      } as ApiResponse);
      return;
    }

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Application ID is required'
      } as ApiResponse);
      return;
    }

    const workflowAction: WorkflowAction = {
      application_id: id,
      action,
      ...(comments && { comments }),
      ...(assigned_to && { assigned_to })
    };

    const result = await executeWorkflowAction(
      id,
      workflowAction,
      req.user.id,
      req.ip,
      req.get('User-Agent')
    );

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.message
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: result.message,
      data: { newStatus: result.newStatus }
    } as ApiResponse);

  } catch (error) {
    console.error('Execute action error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get application statistics
 */
export const getApplicationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    // Build where clause based on user role
    let whereClause = '';
    let queryParams: any[] = [];

    switch (req.user.role) {
      case 'applicant':
        whereClause = 'WHERE applicant_id = $1';
        queryParams.push(req.user.id);
        break;
      case 'project_officer':
        whereClause = 'WHERE assigned_po_id = $1';
        queryParams.push(req.user.id);
        break;
      // Other roles can see all applications
    }

    // Get status counts
    const statusResult = await query(
      `SELECT status, COUNT(*) as count
       FROM applications
       ${whereClause}
       GROUP BY status`,
      queryParams
    );

    // Get type counts
    const typeResult = await query(
      `SELECT type, COUNT(*) as count
       FROM applications
       ${whereClause}
       GROUP BY type`,
      queryParams
    );

    // Get total amount requested
    const amountResult = await query(
      `SELECT 
         COALESCE(SUM(amount_requested), 0) as total_requested,
         COALESCE(SUM(amount_approved), 0) as total_approved
       FROM applications
       ${whereClause}`,
      queryParams
    );

    // Get monthly trends
    const monthlyResult = await query(
      `SELECT 
         DATE_TRUNC('month', created_at) as month,
         COUNT(*) as count
       FROM applications
       ${whereClause}
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC
       LIMIT 12`,
      queryParams
    );

    const stats = {
      status_counts: statusResult.rows.reduce((acc: any, row: any) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, {}),
      type_counts: typeResult.rows.reduce((acc: any, row: any) => {
        acc[row.type] = parseInt(row.count);
        return acc;
      }, {}),
      total_requested: parseFloat(amountResult.rows[0]?.total_requested || '0'),
      total_approved: parseFloat(amountResult.rows[0]?.total_approved || '0'),
      monthly_trends: monthlyResult.rows.map((row: any) => ({
        month: row.month,
        count: parseInt(row.count)
      }))
    };

    res.json({
      success: true,
      data: stats
    } as ApiResponse);

  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};