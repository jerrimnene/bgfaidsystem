import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { User, AuthTokens } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate access and refresh tokens for a user
 */
export const generateTokens = async (user: User, ipAddress?: string, userAgent?: string): Promise<AuthTokens> => {
  const sessionId = uuidv4();
  
  const payload = {
    userId: user.id,
    role: user.role,
    sessionId
  };

  const accessToken = jwt.sign(payload, JWT_SECRET as Secret, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  } as any);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET as Secret, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    algorithm: 'HS256',
  } as any);

  // Store session in database
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await query(
      `INSERT INTO user_sessions 
       (id, user_id, session_token, refresh_token, expires_at, is_active, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, true, $6, $7)`,
      [sessionId, user.id, accessToken, refreshToken, expiresAt, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error storing session:', error);
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 3600 // 1 hour in seconds
  };
};

/**
 * Verify access token
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET as Secret);
  } catch (err) {
    return null;
  }
};

/**
 * Verify access token and throw error if invalid
 */
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET as Secret) as jwt.JwtPayload;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET as Secret) as jwt.JwtPayload;
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Refresh access token using valid refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    // Verify session is still active
    const sessionResult = await query(
      'SELECT * FROM user_sessions WHERE user_id = $1 AND id = $2 AND is_active = true AND expires_at > NOW()',
      [decoded.userId, decoded.sessionId]
    );

    if (sessionResult.rows.length === 0) {
      throw new Error('Session expired or invalid');
    }

    const newPayload = {
      userId: decoded.userId,
      role: decoded.role,
      sessionId: decoded.sessionId
    };

    const newAccessToken = jwt.sign(
      newPayload,
      JWT_SECRET as Secret,
      {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256',
      } as any
    );

    return {
      access_token: newAccessToken,
      refresh_token: refreshToken,
      expires_in: 3600
    };
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Revoke a user session
 */
export const revokeSession = async (sessionId: string) => {
  try {
    await query(
      'UPDATE user_sessions SET is_active = false WHERE id = $1',
      [sessionId]
    );
  } catch (error) {
    console.error('Error revoking session:', error);
    throw error;
  }
};

/**
 * Get active session for a user
 */
export const getActiveSession = async (userId: string, sessionId: string) => {
  try {
    const result = await query(
      'SELECT * FROM user_sessions WHERE user_id = $1 AND id = $2 AND is_active = true AND expires_at > NOW()',
      [userId, sessionId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting active session:', error);
    return null;
  }
};

/**
 * Clean up expired sessions
 */
export const cleanupExpiredSessions = async () => {
  try {
    await query('DELETE FROM user_sessions WHERE expires_at < NOW()');
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    throw error;
  }
};