import express from 'express';
import { body } from 'express-validator';
import {
  getDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
} from '../../controllers/admin/deliveryController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getDeliveryZones);

router.post(
  '/',
  [
    requireRoles('superadmin', 'order_manager'),
    body('name').notEmpty().withMessage('Zone name is required'),
    body('baseRate').isNumeric().withMessage('Base rate must be a number'),
    validate,
  ],
  createDeliveryZone
);

router.put('/:id', requireRoles('superadmin', 'order_manager'), updateDeliveryZone);
router.delete('/:id', requireRoles('superadmin'), deleteDeliveryZone);

export default router;
