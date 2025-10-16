import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
  executeAction
} from '../controllers/applicationController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public application submission route (no authentication required)
router.post('/public', createApplication);

// All other routes require authentication
router.use(authenticate);

// Create application (applicants and admins only)
router.post('/', authorize('applicant', 'admin'), createApplication);

// Get applications (all authenticated users)
router.get('/', getApplications);

// Get application statistics
router.get('/stats', getApplicationStats);

// Get specific application by ID
router.get('/:id', getApplicationById);

// Execute workflow action
router.post('/:id/actions', executeAction);

// Update application
router.put('/:id', updateApplication);

// Delete application
router.delete('/:id', deleteApplication);

export default router;