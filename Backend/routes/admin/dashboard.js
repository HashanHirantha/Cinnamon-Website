import express from 'express';
import { getDashboardStats } from '../../controllers/admin/dashboardController.js';
import { authenticateAdmin } from '../../middleware/adminAuth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/stats', getDashboardStats);

export default router;
