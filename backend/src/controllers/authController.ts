import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { generateTokens, refreshAccessToken, revokeSession } from '../utils/jwt';
import { LoginRequest, RegisterRequest, ApiResponse, AuthTokens, User } from '../types';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      address,
      city,
      country,
      preferred_language = 'en'
    }: RegisterRequest = req.body;

    // Validation
    if (!email || !password || !first_name || !last_name) {
      res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required'
      } as ApiResponse);
      return;
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      } as ApiResponse);
      return;
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    const result = await query(
      `INSERT INTO users (
        id, email, password_hash, first_name, last_name, phone, 
        address, city, country, preferred_language, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, email, first_name, last_name, phone, role, 
                is_active, email_verified, phone_verified, 
                preferred_language, created_at`,
      [
        userId,
        email.toLowerCase(),
        passwordHash,
        first_name,
        last_name,
        phone || null,
        address || null,
        city || null,
        country || null,
        preferred_language,
        'applicant' // Default role for new registrations
      ]
    );

    const newUser = result.rows[0];

    // Generate tokens
    const tokens = await generateTokens(
      newUser,
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          phone: newUser.phone,
          role: newUser.role,
          is_active: newUser.is_active,
          email_verified: newUser.email_verified,
          phone_verified: newUser.phone_verified,
          preferred_language: newUser.preferred_language,
          created_at: newUser.created_at
        },
        tokens
      }
    } as ApiResponse<{ user: Partial<User>; tokens: AuthTokens }>);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse);
      return;
    }

    // Get user by email
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, phone, role, 
              is_active, email_verified, phone_verified, profile_picture_url,
              address, city, country, preferred_language, notification_preferences,
              created_at, updated_at, last_login_at
       FROM users 
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      res.status(401).json({
        success: false,
        error: 'Account is disabled. Please contact support.'
      } as ApiResponse);
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Generate tokens
    const tokens = await generateTokens(
      user,
      req.ip,
      req.get('User-Agent')
    );

    // Update last login time
    await query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Remove password hash from response
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          ...user,
          notification_preferences: user.notification_preferences || { email: true, sms: false, telegram: false }
        },
        tokens
      }
    } as ApiResponse<{ user: User; tokens: AuthTokens }>);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      } as ApiResponse);
      return;
    }

    const tokens = await refreshAccessToken(refresh_token);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    } as ApiResponse<AuthTokens>);

  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Invalid or expired refresh token'
    } as ApiResponse);
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.session) {
      await revokeSession(req.session.id);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    } as ApiResponse);

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get current user profile
 */
export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      } as ApiResponse);
      return;
    }

    // Get fresh user data from database
    const result = await query(
      `SELECT id, email, first_name, last_name, phone, role, 
              is_active, email_verified, phone_verified, profile_picture_url,
              address, city, country, preferred_language, notification_preferences,
              created_at, updated_at, last_login_at
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        ...user,
        notification_preferences: user.notification_preferences || { email: true, sms: false, telegram: false }
      }
    } as ApiResponse<User>);

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      } as ApiResponse);
      return;
    }

    const {
      first_name,
      last_name,
      phone,
      address,
      city,
      country,
      preferred_language,
      notification_preferences
    } = req.body;

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (first_name !== undefined) {
      updateFields.push(`first_name = $${paramIndex++}`);
      updateValues.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push(`last_name = $${paramIndex++}`);
      updateValues.push(last_name);
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramIndex++}`);
      updateValues.push(phone);
    }
    if (address !== undefined) {
      updateFields.push(`address = $${paramIndex++}`);
      updateValues.push(address);
    }
    if (city !== undefined) {
      updateFields.push(`city = $${paramIndex++}`);
      updateValues.push(city);
    }
    if (country !== undefined) {
      updateFields.push(`country = $${paramIndex++}`);
      updateValues.push(country);
    }
    if (preferred_language !== undefined) {
      updateFields.push(`preferred_language = $${paramIndex++}`);
      updateValues.push(preferred_language);
    }
    if (notification_preferences !== undefined) {
      updateFields.push(`notification_preferences = $${paramIndex++}`);
      updateValues.push(JSON.stringify(notification_preferences));
    }

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No fields to update'
      } as ApiResponse);
      return;
    }

    updateValues.push(req.user.id);
    const whereClause = `$${paramIndex}`;

    const result = await query(
      `UPDATE users 
       SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ${whereClause}
       RETURNING id, email, first_name, last_name, phone, role, 
                 is_active, email_verified, phone_verified, profile_picture_url,
                 address, city, country, preferred_language, notification_preferences,
                 created_at, updated_at, last_login_at`,
      updateValues
    );

    const updatedUser = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...updatedUser,
        notification_preferences: updatedUser.notification_preferences || { email: true, sms: false, telegram: false }
      }
    } as ApiResponse<User>);

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      } as ApiResponse);
      return;
    }

    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      } as ApiResponse);
      return;
    }

    // Get current password hash
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    const { password_hash: currentHash } = result.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, currentHash);
    if (!isValidPassword) {
      res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      } as ApiResponse);
      return;
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user.id]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};