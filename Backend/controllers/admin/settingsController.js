import db from '../../config/firebase.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const getStoreSettings = async (req, res, next) => {
  try {
    const docRef = db.collection('settings').doc('store_config');
    const doc = await docRef.get();

    if (!doc.exists) {
      // Default settings
      const defaultSettings = {
        storeName: 'PURE GOLD Products',
        storeTagline: 'Ceylon Cinnamon — Pure Gold from Sri Lanka',
        contactEmail: 'info@puregoldcinnamon.com',
        contactPhone: '+94 77 123 4567',
        currency: 'USD',
        currencySymbol: '$',
        freeShippingThreshold: 50,
        flatShippingRate: 5,
        maintenanceMode: false,
        orderPrefix: 'ORD-',
      };
      await docRef.set(defaultSettings);
      return successResponse(res, defaultSettings, 'Settings retrieved');
    }

    return successResponse(res, doc.data(), 'Settings retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateStoreSettings = async (req, res, next) => {
  try {
    const docRef = db.collection('settings').doc('store_config');
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(updates, { merge: true });
    const updated = await docRef.get();

    return successResponse(res, updated.data(), 'Settings updated successfully');
  } catch (error) {
    next(error);
  }
};
