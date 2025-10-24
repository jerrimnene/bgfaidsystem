import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface Message {
  id?: number;
  application_id: number;
  sender_email: string;
  content: string;
  created_at?: Date;
}

export async function createMessage(msg: Message) {
  const res = await pool.query(
    `INSERT INTO messages (application_id, sender_email, content, created_at)
     VALUES ($1,$2,$3,NOW()) RETURNING *`,
    [msg.application_id, msg.sender_email, msg.content]
  );
  return res.rows[0];
}

export async function getMessages(application_id: number) {
  const res = await pool.query(
    `SELECT * FROM messages WHERE application_id=$1 ORDER BY created_at ASC`,
    [application_id]
  );
  return res.rows;
}
