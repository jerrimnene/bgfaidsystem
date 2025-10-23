import { Pool, PoolClient } from "pg";

let pool: Pool;

/**
 * Initialize database connection using Render PostgreSQL URL.
 */
export const initializeDatabase = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Required for Render Postgres
    });

    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });
  }
  return pool;
};

/**
 * Return the active connection pool.
 */
export const getPool = (): Pool => {
  if (!pool) {
    initializeDatabase();
  }
  return pool;
};

/**
 * Run a single SQL query safely with parameters.
 */
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

/**
 * Execute multiple queries in a transaction.
 * Rolls back automatically on failure.
 */
export const transaction = async (
  callback: (client: PoolClient) => Promise<any>
) => {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction error:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Verify the connection to the database.
 */
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

/**
 * Close the connection pool gracefully.
 */
export const closePool = async () => {
  if (pool) {
    await pool.end();
    console.log("Database connection pool closed");
  }
};
