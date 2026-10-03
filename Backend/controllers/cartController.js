import db from '../config/firebase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { updateDocument } from '../services/firestoreService.js';

/**
 * Helper to determine cart document ID and references
 */
const resolveCartRef = (req) => {
  const userId = req.user?.id || null;
  const guestId = req.body?.guestId || req.query?.guestId || req.headers['x-guest-id'] || req.headers['x-cart-id'] || null;

  if (userId) {
    return {
      docId: `user_${userId}`,
      userId,
      guestId,
      docRef: db.collection('carts').doc(`user_${userId}`),
    };
  }

  if (guestId) {
    const cleanGuestId = guestId.replace(/^guest_/, '');
    return {
      docId: `guest_${cleanGuestId}`,
      userId: null,
      guestId: cleanGuestId,
      docRef: db.collection('carts').doc(`guest_${cleanGuestId}`),
    };
  }

  return {
    docId: null,
    userId: null,
    guestId: null,
    docRef: null,
  };
};

/**
 * Clean & validate cart items array
 */
const cleanCartItems = (cart) => {
  if (!Array.isArray(cart)) return [];
  return cart.map((item) => {
    const price = Number(item.price) || 0;
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    const id = item.id || item.productId || '';
    return {
      id,
      productId: id,
      name: item.name || 'Ceylon Cinnamon Product',
      price: Number(price.toFixed(2)),
      quantity,
      image: item.image || '',
      slug: item.slug || '',
      weight: item.weight || '',
      total: Number((price * quantity).toFixed(2)),
    };
  });
};

/**
 * GET /api/cart
 * Retrieves the current cart for a logged-in customer or guest session
 */
export const getCart = async (req, res, next) => {
  try {
    const { docRef, userId } = resolveCartRef(req);

    if (!docRef) {
      return successResponse(res, { items: [], itemCount: 0, subtotal: 0 }, 'Empty cart');
    }

    const doc = await docRef.get();

    if (doc.exists) {
      const data = doc.data();
      return successResponse(
        res,
        {
          id: doc.id,
          items: data.items || [],
          itemCount: data.itemCount || 0,
          subtotal: data.subtotal || 0,
          updatedAt: data.updatedAt,
        },
        'Cart retrieved successfully'
      );
    }

    // Fallback: If user is logged in, check users collection for backwards compatibility
    if (userId) {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists && userDoc.data().cart?.length > 0) {
        const legacyItems = cleanCartItems(userDoc.data().cart);
        const subtotal = Number(legacyItems.reduce((sum, i) => sum + i.total, 0).toFixed(2));
        const itemCount = legacyItems.reduce((sum, i) => sum + i.quantity, 0);

        // Save into carts collection
        await docRef.set({
          id: docRef.id,
          userId,
          guestId: null,
          items: legacyItems,
          itemCount,
          subtotal,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return successResponse(
          res,
          {
            id: docRef.id,
            items: legacyItems,
            itemCount,
            subtotal,
          },
          'Cart retrieved and migrated'
        );
      }
    }

    return successResponse(res, { items: [], itemCount: 0, subtotal: 0 }, 'Cart is empty');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cart/sync or POST /api/cart/sync
 * Saves the full cart items into the 'carts' collection in Firestore
 */
export const syncCart = async (req, res, next) => {
  try {
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return errorResponse(res, 'Cart must be an array of items', 400);
    }

    const { docId, docRef, userId, guestId } = resolveCartRef(req);

    if (!docRef) {
      return errorResponse(res, 'Missing user authentication or guest identifier', 400);
    }

    const cleanedItems = cleanCartItems(cart);
    const subtotal = Number(cleanedItems.reduce((sum, i) => sum + i.total, 0).toFixed(2));
    const itemCount = cleanedItems.reduce((sum, i) => sum + i.quantity, 0);
    const timestamp = new Date().toISOString();

    const cartData = {
      id: docId,
      userId: userId || null,
      guestId: guestId || null,
      items: cleanedItems,
      itemCount,
      subtotal,
      status: 'active',
      updatedAt: timestamp,
    };

    // Use set with merge to create or update document in 'carts' collection
    await docRef.set(
      {
        ...cartData,
        createdAt: timestamp,
      },
      { merge: true }
    );

    // Also update users.cart if logged in for backward compatibility
    if (userId) {
      await updateDocument('users', userId, { cart: cleanedItems }).catch(() => {});
    }

    console.log(`🛒 Cart saved to Firestore collection 'carts' [${docId}] — ${itemCount} items, $${subtotal}`);

    return successResponse(
      res,
      {
        id: docId,
        items: cleanedItems,
        itemCount,
        subtotal,
        updatedAt: timestamp,
      },
      'Cart saved in database successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cart
 * Clears all items in the cart
 */
export const clearCart = async (req, res, next) => {
  try {
    const { docRef, userId } = resolveCartRef(req);

    if (docRef) {
      await docRef.set(
        {
          items: [],
          itemCount: 0,
          subtotal: 0,
          status: 'cleared',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    if (userId) {
      await updateDocument('users', userId, { cart: [] }).catch(() => {});
    }

    return successResponse(res, { items: [], itemCount: 0, subtotal: 0 }, 'Cart cleared successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cart/merge
 * Merges items from a guest cart into a logged-in user's cart
 */
export const mergeCart = async (req, res, next) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'Authentication required to merge cart', 401);
    }

    const userId = req.user.id;
    const guestId = (req.body?.guestId || req.headers['x-guest-id'] || '').replace(/^guest_/, '');

    if (!guestId) {
      return successResponse(res, null, 'No guest cart to merge');
    }

    const guestRef = db.collection('carts').doc(`guest_${guestId}`);
    const guestDoc = await guestRef.get();

    if (!guestDoc.exists || !guestDoc.data().items?.length) {
      return successResponse(res, null, 'No items in guest cart');
    }

    const guestItems = guestDoc.data().items || [];
    const userRef = db.collection('carts').doc(`user_${userId}`);
    const userDoc = await userRef.get();

    let combinedItems = [];

    if (userDoc.exists && userDoc.data().items?.length) {
      combinedItems = [...userDoc.data().items];
      for (const gItem of guestItems) {
        const existing = combinedItems.find((i) => i.id === gItem.id);
        if (existing) {
          existing.quantity += gItem.quantity;
          existing.total = Number((existing.price * existing.quantity).toFixed(2));
        } else {
          combinedItems.push(gItem);
        }
      }
    } else {
      combinedItems = guestItems;
    }

    const cleanedItems = cleanCartItems(combinedItems);
    const subtotal = Number(cleanedItems.reduce((sum, i) => sum + i.total, 0).toFixed(2));
    const itemCount = cleanedItems.reduce((sum, i) => sum + i.quantity, 0);
    const timestamp = new Date().toISOString();

    await userRef.set(
      {
        id: `user_${userId}`,
        userId,
        items: cleanedItems,
        itemCount,
        subtotal,
        status: 'active',
        updatedAt: timestamp,
      },
      { merge: true }
    );

    // Mark guest cart as merged
    await guestRef.set(
      {
        items: [],
        itemCount: 0,
        subtotal: 0,
        status: 'merged_into_user',
        mergedToUser: userId,
        updatedAt: timestamp,
      },
      { merge: true }
    );

    await updateDocument('users', userId, { cart: cleanedItems }).catch(() => {});

    return successResponse(
      res,
      {
        items: cleanedItems,
        itemCount,
        subtotal,
      },
      'Guest cart merged into user account successfully'
    );
  } catch (error) {
    next(error);
  }
};
