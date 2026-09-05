import db from '../../config/firebase.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getDocumentById, updateDocument } from '../../services/firestoreService.js';

export const getAdminCustomers = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    const [usersSnap, ordersSnap] = await Promise.all([
      db.collection('users').get(),
      db.collection('orders').get(),
    ]);

    const users = usersSnap.docs.map((d) => {
      const data = d.data();
      delete data.passwordHash;
      return { id: d.id, ...data };
    });

    const orders = ordersSnap.docs.map((d) => d.data());

    // Enrich users with order stats
    let enriched = users.map((u) => {
      const userOrders = orders.filter(
        (o) => o.userId === u.id || o.customer?.email?.toLowerCase() === u.email?.toLowerCase()
      );
      const totalSpent = userOrders
        .filter((o) => o.paymentStatus !== 'failed' && o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      return {
        ...u,
        totalOrders: userOrders.length,
        totalSpent: Number(totalSpent.toFixed(2)),
        lastOrderDate: userOrders.length > 0 ? userOrders[0].createdAt : null,
      };
    });

    if (status && status !== 'all') {
      enriched = enriched.filter((u) => u.status === status);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      enriched = enriched.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q) ||
          u.country?.toLowerCase().includes(q)
      );
    }

    enriched.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = enriched.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const paginatedItems = enriched.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return paginatedResponse(res, paginatedItems, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

export const getAdminCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getDocumentById('users', id);

    if (!user) {
      return errorResponse(res, 'Customer not found', 404);
    }

    delete user.passwordHash;

    // Get customer's orders
    const ordersSnap = await db.collection('orders')
      .where('userId', '==', id)
      .get();

    const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return successResponse(res, { ...user, orders }, 'Customer details retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'blocked'].includes(status)) {
      return errorResponse(res, 'Status must be active or blocked', 400);
    }

    const updated = await updateDocument('users', id, { status });
    if (!updated) {
      return errorResponse(res, 'Customer not found', 404);
    }

    delete updated.passwordHash;
    return successResponse(res, updated, `Customer status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};
