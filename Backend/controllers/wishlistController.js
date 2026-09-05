import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getDocumentById, updateDocument } from '../services/firestoreService.js';

export const getWishlist = async (req, res, next) => {
  try {
    const user = await getDocumentById('users', req.user.id);
    return successResponse(res, user?.wishlist || [], 'Wishlist retrieved');
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return errorResponse(res, 'Product ID is required', 400);
    }

    const user = await getDocumentById('users', req.user.id);
    const currentWishlist = Array.isArray(user?.wishlist) ? user.wishlist : [];

    if (!currentWishlist.includes(productId)) {
      currentWishlist.push(productId);
      await updateDocument('users', req.user.id, { wishlist: currentWishlist });
    }

    return successResponse(res, currentWishlist, 'Product added to wishlist');
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await getDocumentById('users', req.user.id);
    const currentWishlist = Array.isArray(user?.wishlist) ? user.wishlist : [];
    const updatedWishlist = currentWishlist.filter((id) => id !== productId);

    await updateDocument('users', req.user.id, { wishlist: updatedWishlist });

    return successResponse(res, updatedWishlist, 'Product removed from wishlist');
  } catch (error) {
    next(error);
  }
};
