import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import configs
import './config/firebase.js';

// Import public & customer routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import reviewRoutes from './routes/reviews.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import contactRoutes from './routes/contact.js';

// Import admin routes
import adminAuthRoutes from './routes/admin/auth.js';
import adminDashboardRoutes from './routes/admin/dashboard.js';
import adminProductRoutes from './routes/admin/products.js';
import adminCategoryRoutes from './routes/admin/categories.js';
import adminOrderRoutes from './routes/admin/orders.js';
import adminCustomerRoutes from './routes/admin/customers.js';
import adminReviewRoutes from './routes/admin/reviews.js';
import adminCouponRoutes from './routes/admin/coupons.js';
import adminDeliveryRoutes from './routes/admin/delivery.js';
import adminNotificationRoutes from './routes/admin/notifications.js';
import adminStaffRoutes from './routes/admin/staff.js';
import adminReportRoutes from './routes/admin/reports.js';
import adminSettingsRoutes from './routes/admin/settings.js';

// Import error handlers
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: true, // Allow frontend dev & production hosts
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ceylon Cinnamon E-Commerce API',
    database: 'Firebase Firestore',
    timestamp: new Date().toISOString(),
  });
});

// Customer & Public API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoutes);

// Admin API Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/customers', adminCustomerRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/admin/delivery', adminDeliveryRoutes);
app.use('/api/admin/notifications', adminNotificationRoutes);
app.use('/api/admin/staff', adminStaffRoutes);
app.use('/api/admin/reports', adminReportRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);

// 404 and Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ceylon Cinnamon API Server listening on port ${PORT}`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
});

export default app;
