import express from 'express';
import { body } from 'express-validator';
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from '../../controllers/admin/orderController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getAdminOrders);
router.get('/:id', getAdminOrderById);

router.patch(
  '/:id/status',
  [
    requireRoles('superadmin', 'order_manager'),
    body('orderStatus').notEmpty().withMessage('Order status is required'),
    validate,
  ],
  updateOrderStatus
);

router.patch(
  '/:id/payment',
  [
    requireRoles('superadmin', 'order_manager'),
    body('paymentStatus').notEmpty().withMessage('Payment status is required'),
    validate,
  ],
  updatePaymentStatus
);

router.delete('/:id', requireRoles('superadmin'), deleteOrder);

export default router;
