import { Request, Response } from "express";
import pool from "../config/database";

export async function getApplications(req: Request, res: Response) {
  try {
    const result = await pool.query(`SELECT * FROM applications ORDER BY created_at DESC`);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
