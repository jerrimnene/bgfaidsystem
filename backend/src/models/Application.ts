import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface Application {
  id?: number;
  tracker_number?: string;
  applicant_name: string;
  email: string;
  phone: string;
  project_title: string;
  description: string;
  amount_requested: number;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function createApplication(app: Application) {
  const tracker = "BGF-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  const result = await pool.query(
    `INSERT INTO applications
     (tracker_number, applicant_name, email, phone, project_title, description, amount_requested, status, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
     RETURNING *`,
    [tracker, app.applicant_name, app.email, app.phone, app.project_title, app.description, app.amount_requested, "Pending Review"]
  );
  return result.rows[0];
}

export async function getAllApplications() {
  const res = await pool.query(`SELECT * FROM applications ORDER BY created_at DESC`);
  return res.rows;
}

export async function getApplicationById(id: number) {
  const res = await pool.query(`SELECT * FROM applications WHERE id = $1`, [id]);
  return res.rows[0];
}
