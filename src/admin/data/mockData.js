// ─── Mock Data for Admin Dashboard ──────────────────────────────────────────
// All data uses localStorage for persistence. Replace with API calls for production.

export const ADMIN_ROLES = {
    SUPER_ADMIN: 'superadmin',
    PRODUCT_MANAGER: 'product_manager',
    ORDER_MANAGER: 'order_manager',
    SUPPORT: 'customer_support',
};

export const ROLE_PERMISSIONS = {
    superadmin: ['*'],
    product_manager: ['products', 'categories', 'inventory'],
    order_manager: ['orders', 'customers', 'delivery'],
    customer_support: ['customers', 'orders', 'reviews'],
};

// ─── Staff ───────────────────────────────────────────────────────────────────
export const mockStaff = [
    { id: 1, name: 'Hashan Hirantha', email: 'admin@ceyloncinnamon.com', role: 'superadmin', status: 'active', createdAt: '2024-01-01', lastLogin: '2026-09-05', avatar: null },
    { id: 2, name: 'Nimal Perera', email: 'products@ceyloncinnamon.com', role: 'product_manager', status: 'active', createdAt: '2024-03-12', lastLogin: '2026-09-04', avatar: null },
    { id: 3, name: 'Kasun Silva', email: 'orders@ceyloncinnamon.com', role: 'order_manager', status: 'active', createdAt: '2024-06-01', lastLogin: '2026-09-03', avatar: null },
    { id: 4, name: 'Dilani Fernando', email: 'support@ceyloncinnamon.com', role: 'customer_support', status: 'inactive', createdAt: '2025-01-15', lastLogin: '2026-08-20', avatar: null },
];

// ─── Customers ────────────────────────────────────────────────────────────────
export const mockCustomers = [
    { id: 1, name: 'Emma Wilson', email: 'emma@example.com', phone: '+44 7911 123456', country: 'United Kingdom', registeredAt: '2025-09-01', orders: 5, totalSpent: 189.45, status: 'active' },
    { id: 2, name: 'James Chen', email: 'james.chen@example.com', phone: '+1 415 555 0192', country: 'United States', registeredAt: '2025-10-14', orders: 3, totalSpent: 94.97, status: 'active' },
    { id: 3, name: 'Sophie Martinez', email: 'sophie@example.com', phone: '+33 6 12 34 56 78', country: 'France', registeredAt: '2025-11-20', orders: 8, totalSpent: 312.80, status: 'active' },
    { id: 4, name: 'Rajiv Patel', email: 'rajiv@example.com', phone: '+91 98765 43210', country: 'India', registeredAt: '2026-01-05', orders: 2, totalSpent: 45.98, status: 'blocked' },
    { id: 5, name: 'Anna Müller', email: 'anna@example.com', phone: '+49 151 12345678', country: 'Germany', registeredAt: '2026-02-18', orders: 6, totalSpent: 221.94, status: 'active' },
    { id: 6, name: 'Liam O\'Brien', email: 'liam@example.com', phone: '+353 87 123 4567', country: 'Ireland', registeredAt: '2026-03-30', orders: 1, totalSpent: 64.99, status: 'active' },
    { id: 7, name: 'Yuki Tanaka', email: 'yuki@example.com', phone: '+81 90 1234 5678', country: 'Japan', registeredAt: '2026-04-12', orders: 4, totalSpent: 158.96, status: 'active' },
    { id: 8, name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '+34 612 345 678', country: 'Spain', registeredAt: '2026-05-07', orders: 2, totalSpent: 39.98, status: 'active' },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const mockOrders = [
    { id: 'ORD-2026-001', customerId: 1, customer: 'Emma Wilson', email: 'emma@example.com', date: '2026-09-05', items: [{ productId: 1, name: 'Ceylon Cinnamon Quills — Premium Grade', qty: 2, price: 18.99 }], subtotal: 37.98, shipping: 5.00, total: 42.98, paymentStatus: 'paid', paymentMethod: 'card', orderStatus: 'delivered', deliveryAddress: '42 Baker St, London, UK', trackingNo: 'TRK-UK-884921' },
    { id: 'ORD-2026-002', customerId: 3, customer: 'Sophie Martinez', email: 'sophie@example.com', date: '2026-09-04', items: [{ productId: 5, name: 'Ceylon Cinnamon Essential Oil', qty: 1, price: 34.99 }, { productId: 3, name: 'Cinnamon Herbal Tea', qty: 2, price: 14.99 }], subtotal: 64.97, shipping: 8.00, total: 72.97, paymentStatus: 'paid', paymentMethod: 'paypal', orderStatus: 'shipped', deliveryAddress: '15 Rue de la Paix, Paris, France', trackingNo: 'TRK-FR-221083' },
    { id: 'ORD-2026-003', customerId: 5, customer: 'Anna Müller', email: 'anna@example.com', date: '2026-09-04', items: [{ productId: 6, name: 'Ceylon Cinnamon Gift Box', qty: 1, price: 64.99 }], subtotal: 64.99, shipping: 10.00, total: 74.99, paymentStatus: 'pending', paymentMethod: 'bank_transfer', orderStatus: 'pending', deliveryAddress: 'Hauptstraße 12, Berlin, Germany', trackingNo: null },
    { id: 'ORD-2026-004', customerId: 7, customer: 'Yuki Tanaka', email: 'yuki@example.com', date: '2026-09-03', items: [{ productId: 2, name: 'Ceylon Cinnamon Powder — Fine Grade', qty: 3, price: 12.99 }], subtotal: 38.97, shipping: 12.00, total: 50.97, paymentStatus: 'paid', paymentMethod: 'card', orderStatus: 'processing', deliveryAddress: '1-2-3 Shinjuku, Tokyo, Japan', trackingNo: null },
    { id: 'ORD-2026-005', customerId: 2, customer: 'James Chen', email: 'james.chen@example.com', date: '2026-09-02', items: [{ productId: 8, name: 'Premium Export Pack', qty: 1, price: 89.99 }], subtotal: 89.99, shipping: 0, total: 89.99, paymentStatus: 'paid', paymentMethod: 'card', orderStatus: 'delivered', deliveryAddress: '100 Market St, San Francisco, CA, USA', trackingNo: 'TRK-US-773419' },
    { id: 'ORD-2026-006', customerId: 4, customer: 'Rajiv Patel', email: 'rajiv@example.com', date: '2026-09-01', items: [{ productId: 4, name: 'Cinnamon Sticks — Select Grade', qty: 2, price: 9.99 }], subtotal: 19.98, shipping: 6.00, total: 25.98, paymentStatus: 'failed', paymentMethod: 'card', orderStatus: 'cancelled', deliveryAddress: '456 MG Road, Mumbai, India', trackingNo: null },
    { id: 'ORD-2026-007', customerId: 6, customer: 'Liam O\'Brien', email: 'liam@example.com', date: '2026-08-30', items: [{ productId: 5, name: 'Ceylon Cinnamon Essential Oil', qty: 1, price: 34.99 }, { productId: 1, name: 'Ceylon Cinnamon Quills — Premium Grade', qty: 1, price: 18.99 }], subtotal: 53.98, shipping: 7.00, total: 60.98, paymentStatus: 'refunded', paymentMethod: 'paypal', orderStatus: 'refunded', deliveryAddress: '8 Grafton St, Dublin, Ireland', trackingNo: 'TRK-IE-994823' },
    { id: 'ORD-2026-008', customerId: 8, customer: 'Carlos Ruiz', email: 'carlos@example.com', date: '2026-08-29', items: [{ productId: 7, name: 'Organic Ceylon Cinnamon Powder', qty: 2, price: 15.99 }], subtotal: 31.98, shipping: 8.00, total: 39.98, paymentStatus: 'paid', paymentMethod: 'card', orderStatus: 'confirmed', deliveryAddress: 'Calle Serrano 45, Madrid, Spain', trackingNo: null },
];

// ─── Payments ─────────────────────────────────────────────────────────────────
export const mockPayments = mockOrders.map((o) => ({
    id: `PAY-${o.id.split('-')[2]}`,
    orderId: o.id,
    customer: o.customer,
    amount: o.total,
    method: o.paymentMethod,
    status: o.paymentStatus,
    date: o.date,
    gateway: o.paymentMethod === 'card' ? 'Stripe' : o.paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer',
}));

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const mockReviews = [
    { id: 1, customer: 'Emma Wilson', productId: 1, product: 'Ceylon Cinnamon Quills — Premium Grade', rating: 5, review: 'Absolutely the best cinnamon I have ever tasted. The aroma is incredible!', date: '2026-09-01', status: 'approved' },
    { id: 2, customer: 'James Chen', productId: 8, product: 'Premium Export Pack', rating: 5, review: 'Outstanding quality. Used in our restaurant and customers love it.', date: '2026-08-28', status: 'approved' },
    { id: 3, customer: 'Sophie Martinez', productId: 5, product: 'Ceylon Cinnamon Essential Oil', rating: 4, review: 'Great oil but the bottle is quite small for the price.', date: '2026-08-25', status: 'pending' },
    { id: 4, customer: 'Anna Müller', productId: 6, product: 'Ceylon Cinnamon Gift Box', rating: 5, review: 'Perfect gift! Beautifully packaged and everything smells divine.', date: '2026-08-20', status: 'approved' },
    { id: 5, customer: 'Rajiv Patel', productId: 4, product: 'Cinnamon Sticks — Select Grade', rating: 2, review: 'Not as fragrant as I expected. Disappointed.', date: '2026-08-15', status: 'pending' },
    { id: 6, customer: 'Liam O\'Brien', productId: 3, product: 'Cinnamon Herbal Tea — Loose Leaf', rating: 4, review: 'Lovely tea. Very soothing in the evenings.', date: '2026-08-10', status: 'rejected' },
];

// ─── Coupons ──────────────────────────────────────────────────────────────────
export const mockCoupons = [
    { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 30, maxDiscount: 20, expiry: '2026-12-31', usageLimit: 100, usedCount: 42, status: 'active' },
    { id: 2, code: 'SUMMER25', type: 'percentage', value: 25, minOrder: 50, maxDiscount: 30, expiry: '2026-09-30', usageLimit: 50, usedCount: 48, status: 'active' },
    { id: 3, code: 'FLAT10', type: 'fixed', value: 10, minOrder: 40, maxDiscount: null, expiry: '2026-10-15', usageLimit: 200, usedCount: 12, status: 'active' },
    { id: 4, code: 'HOLIDAY20', type: 'percentage', value: 20, minOrder: 60, maxDiscount: 25, expiry: '2025-12-31', usageLimit: 150, usedCount: 150, status: 'expired' },
    { id: 5, code: 'FREESHIP', type: 'shipping', value: 100, minOrder: 25, maxDiscount: null, expiry: '2026-11-30', usageLimit: 500, usedCount: 230, status: 'active' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const mockNotifications = [
    { id: 1, type: 'order', icon: '🛍️', title: 'New Order Received', message: 'Order ORD-2026-003 from Anna Müller — $74.99', time: '2026-09-04T10:23:00', read: false },
    { id: 2, type: 'payment', icon: '💳', title: 'Payment Received', message: 'Payment of $42.98 confirmed for ORD-2026-001', time: '2026-09-05T09:15:00', read: false },
    { id: 3, type: 'stock', icon: '⚠️', title: 'Low Stock Alert', message: 'Ceylon Cinnamon Gift Box — only 25 units left', time: '2026-09-04T08:00:00', read: false },
    { id: 4, type: 'customer', icon: '👤', title: 'New Customer Registered', message: 'Carlos Ruiz from Spain joined the store', time: '2026-08-29T14:30:00', read: true },
    { id: 5, type: 'review', icon: '⭐', title: 'New Review Submitted', message: 'Sophie Martinez left a 4-star review', time: '2026-08-25T16:00:00', read: true },
    { id: 6, type: 'stock', icon: '🚫', title: 'Out of Stock', message: 'Ceylon Cinnamon Essential Oil is now out of stock', time: '2026-08-24T11:45:00', read: true },
    { id: 7, type: 'order', icon: '🛍️', title: 'Order Cancelled', message: 'Order ORD-2026-006 was cancelled by customer', time: '2026-09-01T15:10:00', read: true },
];

// ─── Delivery Zones ───────────────────────────────────────────────────────────
export const mockDeliveryZones = [
    { id: 1, zone: 'Domestic (Sri Lanka)', method: 'Standard', minDays: 1, maxDays: 3, charge: 2.50, freeAbove: 30, status: 'active' },
    { id: 2, zone: 'South Asia', method: 'Economy', minDays: 5, maxDays: 10, charge: 8.00, freeAbove: 60, status: 'active' },
    { id: 3, zone: 'Europe', method: 'Economy', minDays: 7, maxDays: 14, charge: 10.00, freeAbove: 75, status: 'active' },
    { id: 4, zone: 'North America', method: 'Economy', minDays: 7, maxDays: 14, charge: 10.00, freeAbove: 75, status: 'active' },
    { id: 5, zone: 'East Asia', method: 'Economy', minDays: 7, maxDays: 14, charge: 12.00, freeAbove: 80, status: 'active' },
    { id: 6, zone: 'Rest of World', method: 'Economy', minDays: 10, maxDays: 21, charge: 15.00, freeAbove: 100, status: 'active' },
    { id: 7, zone: 'Express Worldwide', method: 'Express', minDays: 3, maxDays: 5, charge: 25.00, freeAbove: null, status: 'active' },
];

// ─── Sales Chart Data ─────────────────────────────────────────────────────────
// Revenue by day for different periods
export const salesData = {
    today: [
        { label: '6am', revenue: 42 }, { label: '8am', revenue: 118 }, { label: '10am', revenue: 89 },
        { label: '12pm', revenue: 210 }, { label: '2pm', revenue: 145 }, { label: '4pm', revenue: 98 },
        { label: '6pm', revenue: 176 }, { label: '8pm', revenue: 65 }, { label: '10pm', revenue: 32 },
    ],
    week: [
        { label: 'Mon', revenue: 420 }, { label: 'Tue', revenue: 380 }, { label: 'Wed', revenue: 510 },
        { label: 'Thu', revenue: 290 }, { label: 'Fri', revenue: 680 }, { label: 'Sat', revenue: 750 },
        { label: 'Sun', revenue: 490 },
    ],
    month: Array.from({ length: 30 }, (_, i) => ({
        label: `${i + 1}`,
        revenue: Math.floor(Math.random() * 600 + 200),
    })),
    year: [
        { label: 'Jan', revenue: 4200 }, { label: 'Feb', revenue: 3800 }, { label: 'Mar', revenue: 5100 },
        { label: 'Apr', revenue: 4600 }, { label: 'May', revenue: 6200 }, { label: 'Jun', revenue: 7100 },
        { label: 'Jul', revenue: 8400 }, { label: 'Aug', revenue: 7900 }, { label: 'Sep', revenue: 6300 },
        { label: 'Oct', revenue: 5800 }, { label: 'Nov', revenue: 6700 }, { label: 'Dec', revenue: 9400 },
    ],
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const defaultSettings = {
    general: { storeName: 'Ceylon Cinnamon', email: 'hello@ceyloncinnamon.com', phone: '+94 77 123 4567', address: 'No. 12, Galle Road, Matara, Sri Lanka' },
    currency: { code: 'USD', symbol: '$', position: 'before' },
    social: { facebook: 'https://facebook.com/ceyloncinnamon', instagram: 'https://instagram.com/ceyloncinnamon', youtube: '', twitter: '' },
    notifications: { newOrder: true, lowStock: true, newCustomer: true, newReview: true, orderShipped: true },
};
