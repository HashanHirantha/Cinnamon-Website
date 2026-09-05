import express from 'express';
import { body } from 'express-validator';
import {
  getStaffMembers,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from '../../controllers/admin/staffController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', requireRoles('superadmin'), getStaffMembers);

router.post(
  '/',
  [
    requireRoles('superadmin'),
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
  ],
  createStaffMember
);

router.put('/:id', requireRoles('superadmin'), updateStaffMember);
router.delete('/:id', requireRoles('superadmin'), deleteStaffMember);

export default router;
