import { Request, Response } from 'express';
import { query, transaction } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Create a new help request
export const createHelpRequest = async (req: Request, res: Response) => {
  try {
    const { help_type, urgency_level, title, description, location_description, contact_phone, is_anonymous, preferred_contact_method } = req.body;
    const requesterId = (req as any).user?.id;

    // Validate required fields
    if (!help_type || !title || !description || !requesterId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: help_type, title, description'
      });
    }

    const helpRequestId = uuidv4();

    const result = await transaction(async (client) => {
      // Create help request
      const helpRequest = await client.query(
        `INSERT INTO goodsam_help_requests 
        (id, requester_id, help_type, urgency_level, title, description, location_description, contact_phone, is_anonymous, preferred_contact_method)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [helpRequestId, requesterId, help_type, urgency_level || 'medium', title, description, location_description, contact_phone, is_anonymous || false, preferred_contact_method || 'phone']
      );

      // Create a case for this request (unassigned initially)
      const caseId = uuidv4();
      await client.query(
        `INSERT INTO goodsam_cases (id, help_request_id, status)
        VALUES ($1, $2, $3)`,
        [caseId, helpRequestId, 'unassigned']
      );

      // Find and notify nearby available responders based on help type
      const responders = await client.query(
        `SELECT gr.*, u.email, u.phone 
        FROM goodsam_responders gr
        JOIN users u ON gr.user_id = u.id
        WHERE gr.is_verified = true 
        AND gr.availability_status = 'available'
        AND (gr.responder_type = $1 OR gr.responder_type = 'volunteer')
        LIMIT 5`,
        [help_type === 'counseling' ? 'counselor' : help_type === 'prayer' ? 'pastor' : 'volunteer']
      );

      // Create notifications for available responders
      if (responders.rows.length > 0) {
        for (const responder of responders.rows) {
          const notifId = uuidv4();
          await client.query(
            `INSERT INTO goodsam_notifications 
            (id, responder_id, help_request_id, notification_type, title, message)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              notifId,
              responder.id,
              helpRequestId,
              'new_request',
              `New ${help_type} request - ${urgency_level || 'medium'} priority`,
              title
            ]
          );
        }
      }

      return {
        helpRequest: helpRequest.rows[0],
        caseId: caseId,
        notifiedResponders: responders.rows.length
      };
    });

    res.status(201).json({
      success: true,
      message: 'Help request created successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Error creating help request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create help request'
    });
  }
};

// Get all help requests (with optional filtering)
export const getHelpRequests = async (req: Request, res: Response) => {
  try {
    const { status, help_type, urgency_level, limit = 50, offset = 0 } = req.query;
    let whereClause = '';
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      whereClause += `status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (help_type) {
      whereClause += whereClause ? ' AND' : '';
      whereClause += ` help_type = $${paramIndex}`;
      params.push(help_type);
      paramIndex++;
    }

    if (urgency_level) {
      whereClause += whereClause ? ' AND' : '';
      whereClause += ` urgency_level = $${paramIndex}`;
      params.push(urgency_level);
      paramIndex++;
    }

    const sql = `
      SELECT * FROM goodsam_help_requests
      ${whereClause ? 'WHERE ' + whereClause : ''}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error: any) {
    console.error('Error fetching help requests:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch help requests'
    });
  }
};

// Get help request details with case info
export const getHelpRequestDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        hr.*,
        gc.id as case_id,
        gc.status as case_status,
        gc.assigned_responder_id,
        gr.responder_type,
        u.first_name,
        u.last_name,
        u.phone,
        u.email
      FROM goodsam_help_requests hr
      LEFT JOIN goodsam_cases gc ON hr.id = gc.help_request_id
      LEFT JOIN goodsam_responders gr ON gc.assigned_responder_id = gr.id
      LEFT JOIN users u ON gr.user_id = u.id
      WHERE hr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Help request not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error fetching help request detail:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch help request'
    });
  }
};

// Register a responder (pastor, counselor, volunteer, etc.)
export const registerResponder = async (req: Request, res: Response) => {
  try {
    const { responder_type, organization, service_area, bio, specializations } = req.body;
    const userId = (req as any).user?.id;

    if (!responder_type || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: responder_type'
      });
    }

    const responderId = uuidv4();

    const result = await query(
      `INSERT INTO goodsam_responders 
      (id, user_id, responder_type, organization, service_area, bio, specializations)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [responderId, userId, responder_type, organization, service_area, bio, JSON.stringify(specializations || [])]
    );

    res.status(201).json({
      success: true,
      message: 'Responder registered successfully. Awaiting verification.',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error registering responder:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to register responder'
    });
  }
};

// Get all verified responders
export const getVerifiedResponders = async (req: Request, res: Response) => {
  try {
    const { responder_type, availability_status } = req.query;
    let whereClause = 'is_verified = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (responder_type) {
      whereClause += ` AND responder_type = $${paramIndex}`;
      params.push(responder_type);
      paramIndex++;
    }

    if (availability_status) {
      whereClause += ` AND availability_status = $${paramIndex}`;
      params.push(availability_status);
      paramIndex++;
    }

    const result = await query(
      `SELECT gr.*, u.first_name, u.last_name, u.email, u.phone
      FROM goodsam_responders gr
      JOIN users u ON gr.user_id = u.id
      WHERE ${whereClause}
      ORDER BY gr.completed_cases DESC`,
      params
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('Error fetching responders:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch responders'
    });
  }
};

// Responder accepts/acknowledges a case
export const acknowledgeCase = async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;
    const responderId = (req as any).user?.responder?.id;

    if (!responderId) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized as responder'
      });
    }

    const result = await transaction(async (client) => {
      // Get the case
      const caseResult = await client.query(
        'SELECT * FROM goodsam_cases WHERE id = $1',
        [caseId]
      );

      if (caseResult.rows.length === 0) {
        throw new Error('Case not found');
      }

      const caseData = caseResult.rows[0];

      // Update case - assign responder if not already assigned
      let updateQuery = `
        UPDATE goodsam_cases 
        SET status = 'acknowledged', acknowledged_at = CURRENT_TIMESTAMP
      `;
      const updateParams: any[] = [caseId];

      if (!caseData.assigned_responder_id) {
        updateQuery += `, assigned_responder_id = $2, assigned_at = CURRENT_TIMESTAMP`;
        updateParams.unshift(responderId);
      }

      updateQuery += ` WHERE id = $${updateParams.length + 1} RETURNING *`;
      updateParams.push(caseId);

      const updatedCase = await client.query(updateQuery, updateParams);

      // Log the update
      const logId = uuidv4();
      await client.query(
        `INSERT INTO goodsam_case_updates 
        (id, case_id, responder_id, update_type, message)
        VALUES ($1, $2, $3, $4, $5)`,
        [logId, caseId, responderId, 'initial_contact', 'Responder acknowledged the case']
      );

      return updatedCase.rows[0];
    });

    res.json({
      success: true,
      message: 'Case acknowledged successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Error acknowledging case:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to acknowledge case'
    });
  }
};

// Add case update (progress notes from responder)
export const addCaseUpdate = async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;
    const { update_type, message, supporting_data } = req.body;
    const responderId = (req as any).user?.responder?.id;

    if (!update_type || !message || !responderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: update_type, message'
      });
    }

    const updateId = uuidv4();

    const result = await query(
      `INSERT INTO goodsam_case_updates 
      (id, case_id, responder_id, update_type, message, supporting_data)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [updateId, caseId, responderId, update_type, message, JSON.stringify(supporting_data || {})]
    );

    res.status(201).json({
      success: true,
      message: 'Case update added successfully',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error adding case update:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add case update'
    });
  }
};

// Get case updates/history
export const getCaseUpdates = async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;

    const result = await query(
      `SELECT gcu.*, gr.responder_type, u.first_name, u.last_name
      FROM goodsam_case_updates gcu
      LEFT JOIN goodsam_responders gr ON gcu.responder_id = gr.id
      LEFT JOIN users u ON gr.user_id = u.id
      WHERE gcu.case_id = $1
      ORDER BY gcu.created_at DESC`,
      [caseId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('Error fetching case updates:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch case updates'
    });
  }
};

// Close/complete a case
export const completeCase = async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;
    const { outcome, is_followup_needed } = req.body;

    const result = await query(
      `UPDATE goodsam_cases 
      SET status = 'completed', 
          completed_at = CURRENT_TIMESTAMP,
          outcome = $2,
          is_followup_needed = $3
      WHERE id = $1
      RETURNING *`,
      [caseId, outcome, is_followup_needed !== undefined ? is_followup_needed : true]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    res.json({
      success: true,
      message: 'Case completed successfully',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error completing case:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete case'
    });
  }
};

// Get responder notifications
export const getResponderNotifications = async (req: Request, res: Response) => {
  try {
    const responderId = (req as any).user?.responder?.id;
    const { unread_only } = req.query;

    let whereClause = 'responder_id = $1';
    const params: any[] = [responderId];

    if (unread_only === 'true') {
      whereClause += ' AND is_read = false';
    }

    const result = await query(
      `SELECT * FROM goodsam_notifications
      WHERE ${whereClause}
      ORDER BY created_at DESC`,
      params
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch notifications'
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const result = await query(
      `UPDATE goodsam_notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *`,
      [notificationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update notification'
    });
  }
};

// Get GoodSam dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await transaction(async (client) => {
      // Total requests
      const totalRequests = await client.query(
        'SELECT COUNT(*) as count FROM goodsam_help_requests'
      );

      // Pending requests
      const pendingRequests = await client.query(
        "SELECT COUNT(*) as count FROM goodsam_help_requests WHERE status = 'pending'"
      );

      // Active cases
      const activeCases = await client.query(
        "SELECT COUNT(*) as count FROM goodsam_cases WHERE status IN ('assigned', 'in_progress', 'acknowledged')"
      );

      // Completed cases
      const completedCases = await client.query(
        "SELECT COUNT(*) as count FROM goodsam_cases WHERE status = 'completed'"
      );

      // Verified responders
      const verifiedResponders = await client.query(
        'SELECT COUNT(*) as count FROM goodsam_responders WHERE is_verified = true'
      );

      // Requests by type
      const requestsByType = await client.query(
        'SELECT help_type, COUNT(*) as count FROM goodsam_help_requests GROUP BY help_type'
      );

      // Requests by urgency
      const requestsByUrgency = await client.query(
        'SELECT urgency_level, COUNT(*) as count FROM goodsam_help_requests GROUP BY urgency_level'
      );

      return {
        totalRequests: totalRequests.rows[0].count,
        pendingRequests: pendingRequests.rows[0].count,
        activeCases: activeCases.rows[0].count,
        completedCases: completedCases.rows[0].count,
        verifiedResponders: verifiedResponders.rows[0].count,
        requestsByType: requestsByType.rows,
        requestsByUrgency: requestsByUrgency.rows
      };
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch dashboard stats'
    });
  }
};
