import { Pool } from "pg";

let pool: Pool;

export const initializeDatabase = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required for Render Postgres
    });

    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });
  }
  return pool;
};

export const getPool = (): Pool => {
  if (!pool) {
    initializeDatabase();
  }
  return pool;
};

export const query = async (text: string, params?: any[]) => {
  const client = getPool();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const result = await query("SELECT NOW() as now");
    console.log("✅ Database connected successfully:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    console.log("Database connection pool closed");
  }
};

