import express from 'express';
import { getCart, syncCart, clearCart, mergeCart } from '../controllers/cartController.js';
import { optionalCustomerAuth } from '../middleware/auth.js';

const router = express.Router();

// Allow both logged-in customers and guest shoppers to manage their cart
router.use(optionalCustomerAuth);

router.get('/', getCart);
router.put('/sync', syncCart);
router.post('/sync', syncCart);
router.delete('/', clearCart);
router.post('/merge', mergeCart);

export default router;
