import db from '../../config/firebase.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getDocumentById, updateDocument, deleteDocument } from '../../services/firestoreService.js';

export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const snapshot = await db.collection('orders').get();
    let orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.orderStatus?.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.orderId?.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q) ||
          o.trackingNumber?.toLowerCase().includes(q)
      );
    }

    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = orders.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const paginatedItems = orders.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return paginatedResponse(res, paginatedItems, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

export const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = await getDocumentById('orders', id);

    if (!order) {
      const snap = await db.collection('orders').where('orderId', '==', id).limit(1).get();
      if (!snap.empty) {
        order = { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    }

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, order, 'Order details retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber } = req.body;

    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(orderStatus)) {
      return errorResponse(res, `Invalid order status. Allowed: ${allowedStatuses.join(', ')}`, 400);
    }

    const updates = { orderStatus };
    if (trackingNumber) {
      updates.trackingNumber = trackingNumber.trim();
    }

    const updated = await updateDocument('orders', id, updates);
    if (!updated) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, updated, `Order status updated to ${orderStatus}`);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const allowed = ['pending', 'paid', 'failed', 'refunded'];
    if (!allowed.includes(paymentStatus)) {
      return errorResponse(res, `Invalid payment status. Allowed: ${allowed.join(', ')}`, 400);
    }

    const updated = await updateDocument('orders', id, { paymentStatus });
    if (!updated) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, updated, `Payment status updated to ${paymentStatus}`);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await deleteDocument('orders', id);

    if (!success) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, { id }, 'Order deleted successfully');
  } catch (error) {
    next(error);
  }
};
