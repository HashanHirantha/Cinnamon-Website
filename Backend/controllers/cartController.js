import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getDocumentById, updateDocument } from '../services/firestoreService.js';

export const getCart = async (req, res, next) => {
  try {
    const user = await getDocumentById('users', req.user.id);
    return successResponse(res, user?.cart || [], 'Cart retrieved');
  } catch (error) {
    next(error);
  }
};

export const syncCart = async (req, res, next) => {
  try {
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return errorResponse(res, 'Cart must be an array of items', 400);
    }

    const cleanedCart = cart.map((item) => ({
      id: item.id || item.productId,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
      image: item.image || '',
      slug: item.slug || '',
      weight: item.weight || '',
    }));

    await updateDocument('users', req.user.id, { cart: cleanedCart });
    return successResponse(res, cleanedCart, 'Cart synced successfully');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await updateDocument('users', req.user.id, { cart: [] });
    return successResponse(res, [], 'Cart cleared');
  } catch (error) {
    next(error);
  }
};
