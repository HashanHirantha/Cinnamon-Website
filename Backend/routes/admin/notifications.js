import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../controllers/admin/notificationController.js';
import { authenticateAdmin } from '../../middleware/adminAuth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);

export default router;
