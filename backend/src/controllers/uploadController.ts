import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { ApiResponse, FileUpload } from '../types';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for allowed types
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, Excel, Images, and Text files are allowed.'), false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files at once
  }
});

/**
 * Upload files for an application
 */
export const uploadApplicationFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { id: applicationId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No files uploaded'
      } as ApiResponse);
      return;
    }

    // Check if application exists and user has permission
    const appResult = await query(
      'SELECT * FROM applications WHERE id = $1',
      [applicationId]
    );

    if (appResult.rows.length === 0) {
      // Clean up uploaded files if application doesn't exist
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });

      res.status(404).json({
        success: false,
        error: 'Application not found'
      } as ApiResponse);
      return;
    }

    const application = appResult.rows[0];

    // Check permission
    if (req.user.role === 'applicant' && application.applicant_id !== req.user.id) {
      // Clean up uploaded files
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });

      res.status(403).json({
        success: false,
        error: 'You can only upload files to your own applications'
      } as ApiResponse);
      return;
    }

    // Save file information to database
    const uploadedFiles: FileUpload[] = [];

    for (const file of files) {
      const fileId = uuidv4();
      const fileCategory = req.body.category || 'document';

      const result = await query(
        `INSERT INTO application_files (
          id, application_id, uploaded_by, original_filename, stored_filename,
          file_path, file_size, mime_type, file_category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          fileId,
          applicationId,
          req.user.id,
          file.originalname,
          file.filename,
          file.path,
          file.size,
          file.mimetype,
          fileCategory
        ]
      );

      uploadedFiles.push({
        id: result.rows[0].id,
        application_id: result.rows[0].application_id,
        uploaded_by: result.rows[0].uploaded_by,
        original_filename: result.rows[0].original_filename,
        stored_filename: result.rows[0].stored_filename,
        file_path: result.rows[0].file_path,
        file_size: result.rows[0].file_size,
        mime_type: result.rows[0].mime_type,
        file_category: result.rows[0].file_category,
        is_verified: result.rows[0].is_verified,
        created_at: result.rows[0].created_at
      });
    }

    res.status(201).json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      data: uploadedFiles
    } as ApiResponse<FileUpload[]>);

  } catch (error) {
    console.error('File upload error:', error);

    // Clean up uploaded files on error
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'File upload failed'
    } as ApiResponse);
  }
};

/**
 * Get files for an application
 */
export const getApplicationFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { application_id } = req.params;

    // Check if application exists and user has permission
    const appResult = await query(
      'SELECT * FROM applications WHERE id = $1',
      [application_id]
    );

    if (appResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Application not found'
      } as ApiResponse);
      return;
    }

    const application = appResult.rows[0];

    // Check permission based on role
    let hasPermission = false;
    switch (req.user.role) {
      case 'applicant':
        hasPermission = application.applicant_id === req.user.id;
        break;
      case 'project_officer':
        hasPermission = application.assigned_po_id === req.user.id;
        break;
      default:
        // Other roles can view all files
        hasPermission = ['program_manager', 'finance_director', 'hospital_director', 
                        'executive_director', 'ceo', 'founder', 'admin'].includes(req.user.role);
    }

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: 'You do not have permission to view these files'
      } as ApiResponse);
      return;
    }

    // Get files
    const result = await query(
      `SELECT f.*, u.first_name, u.last_name
       FROM application_files f
       JOIN users u ON f.uploaded_by = u.id
       WHERE f.application_id = $1
       ORDER BY f.created_at DESC`,
      [application_id]
    );

    res.json({
      success: true,
      data: result.rows
    } as ApiResponse<FileUpload[]>);

  } catch (error) {
    console.error('Get application files error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Download a file
 */
export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { file_id } = req.params;

    // Get file information
    const result = await query(
      `SELECT f.*, a.applicant_id, a.assigned_po_id
       FROM application_files f
       JOIN applications a ON f.application_id = a.id
       WHERE f.id = $1`,
      [file_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'File not found'
      } as ApiResponse);
      return;
    }

    const file = result.rows[0];

    // Check permission
    let hasPermission = false;
    switch (req.user.role) {
      case 'applicant':
        hasPermission = file.applicant_id === req.user.id;
        break;
      case 'project_officer':
        hasPermission = file.assigned_po_id === req.user.id;
        break;
      default:
        // Other roles can download all files
        hasPermission = ['program_manager', 'finance_director', 'hospital_director', 
                        'executive_director', 'ceo', 'founder', 'admin'].includes(req.user.role);
    }

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: 'You do not have permission to download this file'
      } as ApiResponse);
      return;
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.file_path)) {
      res.status(404).json({
        success: false,
        error: 'File not found on disk'
      } as ApiResponse);
      return;
    }

    // Set headers for file download
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${file.original_filename}"`);
    res.setHeader('Content-Length', file.file_size);

    // Stream the file
    const fileStream = fs.createReadStream(file.file_path);
    fileStream.pipe(res);

  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({
      success: false,
      error: 'File download failed'
    } as ApiResponse);
  }
};

/**
 * Delete a file
 */
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      } as ApiResponse);
      return;
    }

    const { file_id } = req.params;

    // Get file information
    const result = await query(
      `SELECT f.*, a.applicant_id, a.assigned_po_id
       FROM application_files f
       JOIN applications a ON f.application_id = a.id
       WHERE f.id = $1`,
      [file_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'File not found'
      } as ApiResponse);
      return;
    }

    const file = result.rows[0];

    // Check permission - only file uploader, applicant, or admin can delete
    const canDelete = file.uploaded_by === req.user.id || 
                     (req.user.role === 'applicant' && file.applicant_id === req.user.id) ||
                     req.user.role === 'admin';

    if (!canDelete) {
      res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this file'
      } as ApiResponse);
      return;
    }

    // Delete from database
    await query('DELETE FROM application_files WHERE id = $1', [file_id]);

    // Delete from disk
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'File deletion failed'
    } as ApiResponse);
  }
};