import db from '../config/firebase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getDocumentById, createDocument, updateDocument } from '../services/firestoreService.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      customer,
      paymentMethod = 'cod',
      couponCode,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 'Order must contain at least one item', 400);
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return errorResponse(res, 'Shipping address is incomplete', 400);
    }

    const customerDetails = {
      name: customer?.name || req.user?.name || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
      email: (customer?.email || req.user?.email || shippingAddress.email || '').toLowerCase().trim(),
      phone: customer?.phone || req.user?.phone || shippingAddress.phone || '',
    };

    if (!customerDetails.name || !customerDetails.email) {
      return errorResponse(res, 'Customer name and email are required', 400);
    }

    // Verify stock & calculate order lines
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productId = item.id || item.productId;
      const product = await getDocumentById('products', productId);

      if (!product) {
        return errorResponse(res, `Product not found: ${item.name || productId}`, 404);
      }

      const qty = parseInt(item.quantity, 10) || 1;
      if (product.stock !== undefined && product.stock < qty) {
        return errorResponse(res, `Insufficient stock for ${product.name}. Available: ${product.stock}`, 400);
      }

      const linePrice = Number(product.price);
      const lineTotal = linePrice * qty;
      subtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: linePrice,
        quantity: qty,
        image: product.image || item.image || '',
        weight: product.weight || '',
        total: lineTotal,
      });
    }

    // Check discount / coupon if applied
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const couponSnap = await db.collection('coupons')
        .where('code', '==', couponCode.toUpperCase().trim())
        .where('isActive', '==', true)
        .limit(1)
        .get();

      if (!couponSnap.empty) {
        const coupon = couponSnap.docs[0].data();
        appliedCoupon = coupon.code;
        if (coupon.type === 'percentage') {
          discount = (subtotal * Number(coupon.value)) / 100;
          if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
            discount = Number(coupon.maxDiscount);
          }
        } else if (coupon.type === 'fixed') {
          discount = Math.min(subtotal, Number(coupon.value));
        }
      }
    }

    // Shipping calculation (e.g. Free shipping over $50 or $5 default)
    const shippingFee = subtotal >= 50 ? 0 : 5.00;
    const total = Math.max(0, Number((subtotal - discount + shippingFee).toFixed(2)));

    // Generate unique order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-2025-${randomSuffix}`;

    const orderData = {
      orderId,
      userId: req.user ? req.user.id : null,
      customer: customerDetails,
      items: validatedItems,
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      appliedCoupon,
      shippingFee,
      total,
      shippingAddress: {
        firstName: shippingAddress.firstName || '',
        lastName: shippingAddress.lastName || '',
        address: shippingAddress.address || '',
        apartment: shippingAddress.apartment || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || 'Sri Lanka',
        phone: shippingAddress.phone || customerDetails.phone,
        email: shippingAddress.email || customerDetails.email,
      },
      paymentMethod, // cod | bank_transfer
      paymentStatus: 'pending', // pending | paid | failed
      orderStatus: 'processing', // pending | processing | shipped | delivered | cancelled
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: req.body.notes || '',
    };

    // Save order in Firestore
    const savedOrder = await createDocument('orders', orderData, orderId);

    // Decrement stock for each product
    for (const item of validatedItems) {
      const product = await getDocumentById('products', item.productId);
      if (product && product.stock !== undefined) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await updateDocument('products', item.productId, {
          stock: newStock,
          inStock: newStock > 0,
        });
      }
    }

    // Clear server cart if user was logged in
    if (req.user) {
      await updateDocument('users', req.user.id, { cart: [] });
    }

    // Create an admin notification for the new order
    await createDocument('notifications', {
      title: 'New Order Received',
      message: `Order #${orderId} placed by ${customerDetails.name} for $${total.toFixed(2)}`,
      type: 'order',
      referenceId: orderId,
      isRead: false,
    });

    return successResponse(res, savedOrder, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const snapshot = await db.collection('orders')
      .where('userId', '==', req.user.id)
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return successResponse(res, orders, 'Orders retrieved');
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = await getDocumentById('orders', id);

    if (!order) {
      const snapshot = await db.collection('orders').where('orderId', '==', id).limit(1).get();
      if (!snapshot.empty) {
        order = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
    }

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Customer can only view their own order unless admin
    if (req.user && order.userId && order.userId !== req.user.id) {
      return errorResponse(res, 'Unauthorized to view this order', 403);
    }

    return successResponse(res, order, 'Order details retrieved');
  } catch (error) {
    next(error);
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const { trackingNumber, orderId, email } = req.query;

    if (!trackingNumber && !orderId) {
      return errorResponse(res, 'Order ID or Tracking Number is required', 400);
    }

    let query = db.collection('orders');

    if (trackingNumber) {
      query = query.where('trackingNumber', '==', trackingNumber.trim());
    } else if (orderId) {
      query = query.where('orderId', '==', orderId.trim());
    }

    const snapshot = await query.limit(1).get();
    if (snapshot.empty) {
      return errorResponse(res, 'Order tracking not found', 404);
    }

    const order = snapshot.docs[0].data();

    // Verify email if provided
    if (email && order.customer?.email?.toLowerCase() !== email.toLowerCase().trim()) {
      return errorResponse(res, 'Email does not match this order', 403);
    }

    return successResponse(
      res,
      {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        itemsCount: order.items?.length || 0,
        shippingAddress: {
          city: order.shippingAddress?.city,
          country: order.shippingAddress?.country,
        },
      },
      'Tracking details found'
    );
  } catch (error) {
    next(error);
  }
};
