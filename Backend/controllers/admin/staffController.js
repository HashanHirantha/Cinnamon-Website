import bcrypt from 'bcryptjs';
import db from '../../config/firebase.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { getDocumentById, createDocument, updateDocument, deleteDocument } from '../../services/firestoreService.js';

export const getStaffMembers = async (req, res, next) => {
  try {
    const snapshot = await db.collection('staff').get();
    const staff = snapshot.docs.map((d) => {
      const data = d.data();
      delete data.passwordHash;
      return { id: d.id, ...data };
    });

    return successResponse(res, staff, 'Staff members retrieved');
  } catch (error) {
    next(error);
  }
};

export const createStaffMember = async (req, res, next) => {
  try {
    const { name, username, email, password, role = 'customer_support', permissions } = req.body;

    if (!name || !username || !email || !password) {
      return errorResponse(res, 'Name, username, email, and password are required', 400);
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate
    const userSnap = await db.collection('staff').where('username', '==', cleanUsername).limit(1).get();
    if (!userSnap.empty) {
      return errorResponse(res, 'Username already in use', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newStaff = await createDocument('staff', {
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      role,
      permissions: permissions || (role === 'superadmin' ? ['all'] : [role]),
      status: 'active',
      avatar: '',
      lastLogin: null,
    });

    delete newStaff.passwordHash;
    return successResponse(res, newStaff, 'Staff account created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateStaffMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, password, permissions } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (permissions) updates.permissions = permissions;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(password, salt);
    }

    const updated = await updateDocument('staff', id, updates);
    if (!updated) {
      return errorResponse(res, 'Staff member not found', 404);
    }

    delete updated.passwordHash;
    return successResponse(res, updated, 'Staff member updated');
  } catch (error) {
    next(error);
  }
};

export const deleteStaffMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (req.admin.id === id) {
      return errorResponse(res, 'You cannot delete your own staff account', 400);
    }

    const success = await deleteDocument('staff', id);
    if (!success) {
      return errorResponse(res, 'Staff member not found', 404);
    }

    return successResponse(res, { id }, 'Staff member deleted');
  } catch (error) {
    next(error);
  }
};
