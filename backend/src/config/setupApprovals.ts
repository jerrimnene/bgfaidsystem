import pool from "./database";

export async function setupApprovalsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS approvals (
      id SERIAL PRIMARY KEY,
      application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
      assigned_to VARCHAR(255),
      assigned_role VARCHAR(255),
      status VARCHAR(50) DEFAULT 'PENDING',
      review_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ approvals table verified/created successfully");
}
