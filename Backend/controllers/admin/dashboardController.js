import db from '../../config/firebase.js';
import { successResponse } from '../../utils/apiResponse.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [ordersSnap, productsSnap, usersSnap, reviewsSnap] = await Promise.all([
      db.collection('orders').get(),
      db.collection('products').get(),
      db.collection('users').get(),
      db.collection('reviews').get(),
    ]);

    const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const reviews = reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Revenue calculations
    const totalRevenue = orders
      .filter((o) => o.paymentStatus !== 'failed' && o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'processing' || o.orderStatus === 'pending').length;

    // Recent orders sorted by date
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    // Low stock products
    const lowStockProducts = products
      .filter((p) => (p.stock || 0) <= 15)
      .slice(0, 5);

    // Top selling products based on order frequency
    const productSalesMap = {};
    for (const order of orders) {
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          const pid = item.productId || item.id;
          if (pid) {
            productSalesMap[pid] = (productSalesMap[pid] || 0) + (item.quantity || 1);
          }
        }
      }
    }

    const topSellingProducts = products
      .map((p) => ({
        ...p,
        unitsSold: productSalesMap[p.id] || 0,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    return successResponse(res, {
      kpi: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders: orders.length,
        pendingOrders: pendingOrdersCount,
        totalCustomers: users.length,
        totalProducts: products.length,
      },
      recentOrders,
      lowStockProducts,
      topSellingProducts,
      recentReviewsCount: reviews.length,
    }, 'Dashboard stats retrieved');
  } catch (error) {
    next(error);
  }
};
