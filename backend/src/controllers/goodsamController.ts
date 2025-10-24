import { Request, Response } from "express";
import pool from "../config/database";

export async function createGoodSam(req: Request, res: Response) {
  try {
    const { name, category, description } = req.body;
    const result = await pool.query(
      `INSERT INTO goodsam (name, category, description, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [name, category, description]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getGoodSamList(req: Request, res: Response) {
  try {
    const result = await pool.query(`SELECT * FROM goodsam ORDER BY created_at DESC`);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
