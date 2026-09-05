import express from 'express';
import { body } from 'express-validator';
import {
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../../controllers/admin/couponController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getAdminCoupons);

router.post(
  '/',
  [
    requireRoles('superadmin', 'product_manager'),
    body('code').notEmpty().withMessage('Coupon code is required'),
    body('type').isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
    body('value').isNumeric().withMessage('Value must be a number'),
    validate,
  ],
  createCoupon
);

router.put('/:id', requireRoles('superadmin', 'product_manager'), updateCoupon);
router.delete('/:id', requireRoles('superadmin', 'product_manager'), deleteCoupon);

export default router;
