import express from 'express';
import {
  getAdminCustomers,
  getAdminCustomerById,
  updateCustomerStatus,
} from '../../controllers/admin/customerController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getAdminCustomers);
router.get('/:id', getAdminCustomerById);
router.patch('/:id/status', requireRoles('superadmin', 'order_manager', 'customer_support'), updateCustomerStatus);

export default router;
