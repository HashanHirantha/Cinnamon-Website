import { verifyCustomerToken } from '../config/jwt.js';
import { errorResponse } from '../utils/apiResponse.js';
import db from '../config/firebase.js';

export const authenticateCustomer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No authorization token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyCustomerToken(token);

    if (!decoded || !decoded.userId) {
      return errorResponse(res, 'Invalid or expired token.', 401);
    }

    // Fetch user from Firestore
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    if (!userDoc.exists) {
      return errorResponse(res, 'User not found or account deactivated.', 401);
    }

    const userData = userDoc.data();
    if (userData.status === 'blocked' || userData.status === 'inactive') {
      return errorResponse(res, 'Account is disabled. Please contact support.', 403);
    }

    req.user = {
      id: userDoc.id,
      ...userData,
    };
    delete req.user.passwordHash;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Authentication failed.', 401, error);
  }
};

export const optionalCustomerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyCustomerToken(token);
      if (decoded && decoded.userId) {
        const userDoc = await db.collection('users').doc(decoded.userId).get();
        if (userDoc.exists) {
          req.user = {
            id: userDoc.id,
            ...userDoc.data(),
          };
          delete req.user.passwordHash;
        }
      }
    }
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
};
