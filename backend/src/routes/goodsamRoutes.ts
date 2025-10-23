import express from 'express';
import * as goodsamController from '../controllers/goodsamController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Help Request Routes
router.post('/help-request', authenticate, goodsamController.createHelpRequest);
router.get('/help-requests', goodsamController.getHelpRequests);
router.get('/help-requests/:id', goodsamController.getHelpRequestDetail);

// Responder Routes
router.post('/responders/register', authenticate, goodsamController.registerResponder);
router.get('/responders/verified', goodsamController.getVerifiedResponders);

// Case Management Routes
router.post('/cases/:caseId/acknowledge', authenticate, goodsamController.acknowledgeCase);
router.post('/cases/:caseId/updates', authenticate, goodsamController.addCaseUpdate);
router.get('/cases/:caseId/updates', goodsamController.getCaseUpdates);
router.post('/cases/:caseId/complete', authenticate, goodsamController.completeCase);

// Notification Routes
router.get('/notifications', authenticate, goodsamController.getResponderNotifications);
router.post('/notifications/:notificationId/read', authenticate, goodsamController.markNotificationAsRead);

// Dashboard Routes
router.get('/dashboard/stats', authenticate, goodsamController.getDashboardStats);

export default router;
