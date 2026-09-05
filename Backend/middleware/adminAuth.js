import { verifyAdminToken } from '../config/jwt.js';
import { errorResponse } from '../utils/apiResponse.js';
import db from '../config/firebase.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Admin authentication required.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAdminToken(token);

    if (!decoded || !decoded.staffId) {
      return errorResponse(res, 'Invalid or expired admin token.', 401);
    }

    // Fetch staff member from Firestore
    const staffDoc = await db.collection('staff').doc(decoded.staffId).get();
    if (!staffDoc.exists) {
      return errorResponse(res, 'Staff account not found.', 401);
    }

    const staffData = staffDoc.data();
    if (staffData.status !== 'active') {
      return errorResponse(res, 'Staff account is inactive or suspended.', 403);
    }

    req.admin = {
      id: staffDoc.id,
      ...staffData,
    };
    delete req.admin.passwordHash;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Admin session expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Admin authentication failed.', 401, error);
  }
};

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return errorResponse(res, 'Unauthorized.', 401);
    }

    // superadmin always has access
    if (req.admin.role === 'superadmin') {
      return next();
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return errorResponse(res, `Access forbidden. Requires one of: ${allowedRoles.join(', ')}`, 403);
    }

    next();
  };
};
