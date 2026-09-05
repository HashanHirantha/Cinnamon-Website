import bcrypt from 'bcryptjs';
import db from '../config/firebase.js';
import { generateCustomerToken } from '../config/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getDocumentById, getDocumentByField, createDocument, updateDocument } from '../services/firestoreService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, country } = req.body;

    if (!email || !password || !name) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await getDocumentByField('users', 'email', normalizedEmail);
    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await createDocument('users', {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone ? phone.trim() : '',
      country: country ? country.trim() : 'Sri Lanka',
      addresses: [],
      cart: [],
      wishlist: [],
      role: 'customer',
      status: 'active',
    });

    const userPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      country: newUser.country,
      role: newUser.role,
    };

    const token = generateCustomerToken({ userId: newUser.id, email: newUser.email });

    return successResponse(res, { user: userPayload, token }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await getDocumentByField('users', 'email', normalizedEmail);

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    if (user.status === 'blocked' || user.status === 'inactive') {
      return errorResponse(res, 'Account is disabled. Please contact support.', 403);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateCustomerToken({ userId: user.id, email: user.email });

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      country: user.country || '',
      addresses: user.addresses || [],
      cart: user.cart || [],
      wishlist: user.wishlist || [],
      role: user.role || 'customer',
    };

    return successResponse(res, { user: userPayload, token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getDocumentById('users', req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const { passwordHash, ...safeUser } = user;
    return successResponse(res, safeUser, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, country, addresses } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (country !== undefined) updateData.country = country.trim();
    if (addresses !== undefined) updateData.addresses = addresses;

    const updatedUser = await updateDocument('users', req.user.id, updateData);
    const { passwordHash, ...safeUser } = updatedUser;

    return successResponse(res, safeUser, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Current and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters long', 400);
    }

    const user = await getDocumentById('users', req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return errorResponse(res, 'Incorrect current password', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await updateDocument('users', req.user.id, { passwordHash });

    return successResponse(res, null, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};
