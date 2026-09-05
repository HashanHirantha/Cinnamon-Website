import db from '../../config/firebase.js';
import { successResponse } from '../../utils/apiResponse.js';

export const getSalesReport = async (req, res, next) => {
  try {
    const [ordersSnap, productsSnap] = await Promise.all([
      db.collection('orders').get(),
      db.collection('products').get(),
    ]);

    const orders = ordersSnap.docs.map((d) => d.data());
    const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const validOrders = orders.filter(
      (o) => o.paymentStatus !== 'failed' && o.orderStatus !== 'cancelled'
    );

    const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'cancelled').length;

    // Sales by Category
    const categorySales = {};
    for (const order of validOrders) {
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          const product = products.find((p) => p.id === item.productId);
          const cat = product?.category || 'other';
          categorySales[cat] = (categorySales[cat] || 0) + (Number(item.total) || 0);
        }
      }
    }

    // Orders status distribution
    const statusBreakdown = {
      pending: orders.filter((o) => o.orderStatus === 'pending').length,
      processing: orders.filter((o) => o.orderStatus === 'processing').length,
      shipped: orders.filter((o) => o.orderStatus === 'shipped').length,
      delivered: completedOrders,
      cancelled: cancelledOrders,
    };

    return successResponse(res, {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      averageOrderValue: totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0,
      completedOrders,
      cancelledOrders,
      categorySales,
      statusBreakdown,
    }, 'Sales report retrieved');
  } catch (error) {
    next(error);
  }
};
