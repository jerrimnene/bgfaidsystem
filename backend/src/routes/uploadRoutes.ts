import { Router } from 'express';
import {
  upload,
  uploadApplicationFiles,
  getApplicationFiles,
  downloadFile,
  deleteFile
} from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Upload files to an application
router.post('/applications/:id/files', upload.array('files', 10), uploadApplicationFiles);

// Get files for an application
router.get('/applications/:application_id/files', getApplicationFiles);

// Download a specific file
router.get('/files/:file_id/download', downloadFile);

// Delete a file
router.delete('/files/:file_id', deleteFile);

export default router;