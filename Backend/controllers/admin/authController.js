import bcrypt from 'bcryptjs';
import db from '../../config/firebase.js';
import { generateAdminToken } from '../../config/jwt.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { getDocumentById, updateDocument } from '../../services/firestoreService.js';

export const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(res, 'Username/email and password are required', 400);
    }

    const cleanUsername = username.trim().toLowerCase();

    // Query staff by username or email
    const staffSnapshot = await db.collection('staff')
      .where('username', '==', cleanUsername)
      .limit(1)
      .get();

    let staffDoc = staffSnapshot.empty ? null : staffSnapshot.docs[0];

    if (!staffDoc) {
      const emailSnapshot = await db.collection('staff')
        .where('email', '==', cleanUsername)
        .limit(1)
        .get();
      if (!emailSnapshot.empty) {
        staffDoc = emailSnapshot.docs[0];
      }
    }

    if (!staffDoc) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const staff = { id: staffDoc.id, ...staffDoc.data() };

    if (staff.status !== 'active') {
      return errorResponse(res, 'Account is inactive. Contact Administrator.', 403);
    }

    const isMatch = await bcrypt.compare(password, staff.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Update lastLogin
    await updateDocument('staff', staff.id, {
      lastLogin: new Date().toISOString(),
    });

    const token = generateAdminToken({
      staffId: staff.id,
      username: staff.username,
      role: staff.role,
    });

    const staffPayload = {
      id: staff.id,
      name: staff.name,
      username: staff.username,
      email: staff.email,
      role: staff.role,
      permissions: staff.permissions || ['all'],
      avatar: staff.avatar || '',
    };

    return successResponse(res, { admin: staffPayload, token }, 'Admin login successful');
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    const staff = await getDocumentById('staff', req.admin.id);
    if (!staff) {
      return errorResponse(res, 'Staff member not found', 404);
    }

    const { passwordHash, ...safeStaff } = staff;
    return successResponse(res, safeStaff, 'Admin profile retrieved');
  } catch (error) {
    next(error);
  }
};
