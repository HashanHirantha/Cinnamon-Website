import express from 'express';
import { getCart, syncCart, clearCart } from '../controllers/cartController.js';
import { authenticateCustomer } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateCustomer);

router.get('/', getCart);
router.put('/sync', syncCart);
router.delete('/', clearCart);

export default router;
