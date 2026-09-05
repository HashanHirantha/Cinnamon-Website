import express from 'express';
import { body } from 'express-validator';
import { createOrder, getMyOrders, getOrderById, trackOrder } from '../controllers/orderController.js';
import { authenticateCustomer, optionalCustomerAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Public tracking
router.get('/track', trackOrder);

// Create order (both authenticated & guest)
router.post(
  '/',
  [
    optionalCustomerAuth,
    body('items').isArray({ min: 1 }).withMessage('Cart items are required'),
    body('shippingAddress').isObject().withMessage('Shipping address is required'),
    validate,
  ],
  createOrder
);

// Authenticated customer orders
router.get('/my-orders', authenticateCustomer, getMyOrders);
router.get('/:id', optionalCustomerAuth, getOrderById);

export default router;
