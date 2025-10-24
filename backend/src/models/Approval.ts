import pool from "../config/database";

export interface Approval {
  id?: number;
  application_id: number;
  assigned_to: string;
  assigned_role: string;
  status: string;
  review_notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Create new approval (initial assignment)
export async function createApproval(application_id: number, assigned_to: string, assigned_role: string) {
  const result = await pool.query(
    `INSERT INTO approvals (application_id, assigned_to, assigned_role, status, created_at, updated_at)
     VALUES ($1,$2,$3,'PENDING',NOW(),NOW()) RETURNING *`,
    [application_id, assigned_to, assigned_role]
  );
  return result.rows[0];
}

// Update approval (change status or add notes)
export async function updateApproval(application_id: number, assigned_to: string, status: string, review_notes?: string) {
  const result = await pool.query(
    `UPDATE approvals
     SET status=$1, review_notes=$2, updated_at=NOW()
     WHERE application_id=$3 AND assigned_to=$4
     RETURNING *`,
    [status, review_notes || null, application_id, assigned_to]
  );
  return result.rows[0];
}

// Get approvals assigned to a staff member
export async function getApprovalsByAssignee(assigned_to: string) {
  const result = await pool.query(
    `SELECT a.*, ap.tracker_number, ap.project_title, ap.applicant_name
     FROM approvals a
     JOIN applications ap ON ap.id = a.application_id
     WHERE a.assigned_to=$1
     ORDER BY a.created_at DESC`,
    [assigned_to]
  );
  return result.rows;
}
