import db from '../../config/firebase.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { getDocumentById, createDocument, updateDocument, deleteDocument } from '../../services/firestoreService.js';

export const getAdminCoupons = async (req, res, next) => {
  try {
    const snapshot = await db.collection('coupons').get();
    const coupons = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return successResponse(res, coupons, 'Coupons retrieved');
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, type, value, minOrder = 0, maxDiscount, expiresAt, isActive = true } = req.body;

    if (!code || !type || value === undefined) {
      return errorResponse(res, 'Code, type, and value are required', 400);
    }

    const cleanCode = code.trim().toUpperCase();

    const existingSnap = await db.collection('coupons').where('code', '==', cleanCode).limit(1).get();
    if (!existingSnap.empty) {
      return errorResponse(res, 'A coupon with this code already exists', 409);
    }

    const coupon = await createDocument('coupons', {
      code: cleanCode,
      type, // 'percentage' | 'fixed'
      value: Number(value),
      minOrder: Number(minOrder),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      expiresAt: expiresAt || null,
      isActive: !!isActive,
      usageCount: 0,
    });

    return successResponse(res, coupon, 'Coupon created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateDocument('coupons', id, req.body);

    if (!updated) {
      return errorResponse(res, 'Coupon not found', 404);
    }

    return successResponse(res, updated, 'Coupon updated');
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteDocument('coupons', id);

    if (!success) {
      return errorResponse(res, 'Coupon not found', 404);
    }

    return successResponse(res, { id }, 'Coupon deleted');
  } catch (error) {
    next(error);
  }
};
