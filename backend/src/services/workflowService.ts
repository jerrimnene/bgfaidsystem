import pool from "../config/database";

export async function getWorkflow() {
  const result = await pool.query(`SELECT * FROM workflow ORDER BY id ASC`);
  return result.rows;
}
