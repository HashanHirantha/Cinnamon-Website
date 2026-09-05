import express from 'express';
import {
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} from '../../controllers/admin/reviewController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getAdminReviews);
router.patch('/:id/status', requireRoles('superadmin', 'product_manager', 'customer_support'), updateReviewStatus);
router.delete('/:id', requireRoles('superadmin', 'product_manager'), deleteReview);

export default router;
