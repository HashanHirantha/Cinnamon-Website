import express from 'express';
import { getStoreSettings, updateStoreSettings } from '../../controllers/admin/settingsController.js';
import { authenticateAdmin, requireRoles } from '../../middleware/adminAuth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getStoreSettings);
router.put('/', requireRoles('superadmin'), updateStoreSettings);

export default router;
