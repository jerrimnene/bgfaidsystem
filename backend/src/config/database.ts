import { Pool, PoolClient } from 'pg';

// Database connection pool
let pool: Pool;

// Initialize database connection
export const initializeDatabase = () => {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'bgf_aid_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20, // Maximum number of clients in pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
  });

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  return pool;
};

// Get the pool instance
export const getPool = (): Pool => {
  if (!pool) {
    initializeDatabase();
  }
  return pool;
};

// Query helper function
export const query = async (text: string, params?: any[]) => {
  const client = getPool();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper
export const transaction = async (callback: (client: PoolClient) => Promise<any>) => {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Test database connection
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as now');
    console.log('✅ Database connected successfully');
    return result.rows[0];
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Close database connection
export const closePool = async () => {
  if (pool) {
    await pool.end();
    console.log('Database connection pool closed');
  }
};