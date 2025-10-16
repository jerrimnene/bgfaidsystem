import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  refresh, 
  me, 
  updateProfile, 
  changePassword 
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;