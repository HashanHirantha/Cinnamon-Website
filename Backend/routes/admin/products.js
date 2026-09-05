import express from 'express';
import { body } from 'express-validator';
import {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
} from '../../controllers/admin/productController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getAdminProducts);
router.get('/:id', getAdminProductById);

router.post(
  '/',
  [
    requireRoles('superadmin', 'product_manager'),
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Valid price is required'),
    body('category').notEmpty().withMessage('Category is required'),
    validate,
  ],
  createProduct
);

router.put('/:id', requireRoles('superadmin', 'product_manager'), updateProduct);
router.delete('/:id', requireRoles('superadmin'), deleteProduct);
router.patch('/:id/stock', requireRoles('superadmin', 'product_manager'), adjustStock);

export default router;
