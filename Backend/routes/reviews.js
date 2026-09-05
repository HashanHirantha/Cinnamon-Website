import express from 'express';
import { body } from 'express-validator';
import { getProductReviews, createReview } from '../controllers/reviewController.js';
import { optionalCustomerAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/:productId', getProductReviews);
router.post(
  '/',
  [
    optionalCustomerAuth,
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
    validate,
  ],
  createReview
);

export default router;
