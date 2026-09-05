import express from 'express';
import { body } from 'express-validator';
import { adminLogin, getAdminProfile } from '../../controllers/admin/authController.js';
import { authenticateAdmin } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  adminLogin
);

router.get('/me', authenticateAdmin, getAdminProfile);

export default router;
