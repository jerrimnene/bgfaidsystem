import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({ success: true, token, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
