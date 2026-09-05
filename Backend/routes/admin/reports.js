import express from 'express';
import { getSalesReport } from '../../controllers/admin/reportController.js';
import { authenticateAdmin } from '../../middleware/adminAuth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getSalesReport);

export default router;
