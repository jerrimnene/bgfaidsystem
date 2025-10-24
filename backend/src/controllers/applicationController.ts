import { Request, Response } from "express";
import pool from "../config/database";
import { createApproval } from "../models/Approval";
import crypto from "crypto";

// Generate unique tracker number
function generateTracker() {
  const unique = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `BGF-${unique}`;
}

// Submit new application
export async function submitApplication(req: Request, res: Response) {
  try {
    const { applicant_name, email, phone, project_title, description, amount_requested } = req.body;

    if (!applicant_name || !email || !phone || !project_title || !description || !amount_requested) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    const tracker_number = generateTracker();
    const submission_date = new Date();

    const result = await pool.query(
      `INSERT INTO applications (tracker_number, applicant_name, email, phone, project_title, description, amount_requested, submission_date, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW()) RETURNING *`,
      [tracker_number, applicant_name, email, phone, project_title, description, amount_requested, submission_date]
    );

    const newApp = result.rows[0];

    // Automatically assign to Program Manager
    await createApproval(newApp.id, "program.manager@bgf.com", "Program Manager");

    res.json({ success: true, tracker_number, data: newApp });
  } catch (error: any) {
    console.error("❌ Application submission error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get all applications
export async function getApplications(req: Request, res: Response) {
  try {
    const result = await pool.query(`SELECT * FROM applications ORDER BY created_at DESC`);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get single application by tracker number
export async function getApplicationByTracker(req: Request, res: Response) {
  try {
    const { tracker } = req.params;
    const result = await pool.query(`SELECT * FROM applications WHERE tracker_number=$1`, [tracker]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
