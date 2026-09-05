import db from '../../config/firebase.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { createDocument, updateDocument, deleteDocument } from '../../services/firestoreService.js';

export const getDeliveryZones = async (req, res, next) => {
  try {
    const snapshot = await db.collection('deliveryZones').get();
    const zones = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return successResponse(res, zones, 'Delivery zones retrieved');
  } catch (error) {
    next(error);
  }
};

export const createDeliveryZone = async (req, res, next) => {
  try {
    const { name, country, regions, baseRate, freeShippingThreshold, estimatedDays, isActive = true } = req.body;

    if (!name || baseRate === undefined) {
      return errorResponse(res, 'Zone name and base rate are required', 400);
    }

    const zone = await createDocument('deliveryZones', {
      name: name.trim(),
      country: country || 'Sri Lanka',
      regions: Array.isArray(regions) ? regions : [],
      baseRate: Number(baseRate),
      freeShippingThreshold: freeShippingThreshold ? Number(freeShippingThreshold) : null,
      estimatedDays: estimatedDays || '2-4 business days',
      isActive: !!isActive,
    });

    return successResponse(res, zone, 'Delivery zone created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateDocument('deliveryZones', id, req.body);

    if (!updated) {
      return errorResponse(res, 'Delivery zone not found', 404);
    }

    return successResponse(res, updated, 'Delivery zone updated');
  } catch (error) {
    next(error);
  }
};

export const deleteDeliveryZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteDocument('deliveryZones', id);

    if (!success) {
      return errorResponse(res, 'Delivery zone not found', 404);
    }

    return successResponse(res, { id }, 'Delivery zone deleted');
  } catch (error) {
    next(error);
  }
};
