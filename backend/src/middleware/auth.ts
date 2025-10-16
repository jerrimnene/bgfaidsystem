import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { query } from '../config/database';
import { User, UserRole } from '../types';

/**
 * Extract token from request headers
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

/**
 * Authentication middleware - verifies JWT token and adds user to request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify the token
    const payload = verifyAccessToken(token);

    // Get user and session from database
    const userResult = await query(
      `SELECT u.*, us.* FROM users u
       JOIN user_sessions us ON u.id = us.user_id
       WHERE u.id = $1 AND us.id = $2 AND us.is_active = true AND us.expires_at > NOW()`,
      [payload.userId, payload.sessionId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid session or user not found'
      });
    }

    const userData = userResult.rows[0];

    // Check if user is active
    if (!userData.is_active) {
      return res.status(401).json({
        success: false,
        error: 'User account is disabled'
      });
    }

    // Update last login time
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [userData.id]
    );

    // Add user to request object
    req.user = {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      role: userData.role,
      is_active: userData.is_active,
      email_verified: userData.email_verified,
      phone_verified: userData.phone_verified,
      profile_picture_url: userData.profile_picture_url,
      address: userData.address,
      city: userData.city,
      country: userData.country,
      preferred_language: userData.preferred_language,
      notification_preferences: userData.notification_preferences,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      last_login_at: userData.last_login_at
    } as User;

    // Add session to request object
    req.session = {
      id: userData.id,
      user_id: userData.user_id,
      session_token: userData.session_token,
      refresh_token: userData.refresh_token,
      expires_at: userData.expires_at,
      is_active: userData.is_active,
      ip_address: userData.ip_address,
      user_agent: userData.user_agent,
      created_at: userData.created_at
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);
    
    const userResult = await query(
      `SELECT u.* FROM users u
       JOIN user_sessions us ON u.id = us.user_id
       WHERE u.id = $1 AND us.id = $2 AND us.is_active = true AND us.expires_at > NOW()`,
      [payload.userId, payload.sessionId]
    );

    if (userResult.rows.length > 0) {
      const userData = userResult.rows[0];
      req.user = userData;
    }

    next();
  } catch (error) {
    // If token is invalid, continue without user (optional auth)
    next();
  }
};