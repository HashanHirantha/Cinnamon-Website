import express from 'express';
import { body } from 'express-validator';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../controllers/admin/categoryController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getAdminCategories);

router.post(
  '/',
  [
    requireRoles('superadmin', 'product_manager'),
    body('name').notEmpty().withMessage('Category name is required'),
    validate,
  ],
  createCategory
);

router.put('/:id', requireRoles('superadmin', 'product_manager'), updateCategory);
router.delete('/:id', requireRoles('superadmin'), deleteCategory);

export default router;
