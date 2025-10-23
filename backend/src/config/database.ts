import { Pool, PoolClient } from 'pg';

// Create connection pool
let pool: Pool;

export const initializeDatabase = () => {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false } // required for Render Postgres
    });
  } else {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'bgf_aid_system',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
    });
  }

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

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
    console.error('Database query error:', error);
    throw error;
  }
};

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

export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as now');
    console.log('✅ Database connected successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    console.log('Database connection pool closed');
  }
};
