import { Request, Response } from "express";
import pool from "../config/database";

export async function getUploads(req: Request, res: Response) {
  try {
    const result = await pool.query(`SELECT * FROM uploads ORDER BY created_at DESC`);
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
