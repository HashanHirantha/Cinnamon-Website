// PURE GOLD Products — Centralized API Client

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Standard fetch wrapper with auth header injection & error handling
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Determine token: check admin token if endpoint starts with /admin, else customer token
  const isAdminRequest = endpoint.startsWith('/admin');
  const tokenKey = isAdminRequest ? 'ceylone_admin_token' : 'ceylone_token';
  const token = localStorage.getItem(tokenKey);

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint, params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return request(query ? `${endpoint}?${query}` : endpoint, { method: 'GET' });
  },
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

// ─── Customer Auth APIs ────────────────────────────────────────────────────────
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/me', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// ─── Admin Auth APIs ───────────────────────────────────────────────────────────
export const adminAuthApi = {
  login: (credentials) => api.post('/admin/auth/login', credentials),
  getProfile: () => api.get('/admin/auth/me'),
};

// ─── Products APIs ─────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params) => api.get('/products', params),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products/featured'),
};

// ─── Categories APIs ───────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// ─── Reviews APIs ──────────────────────────────────────────────────────────────
export const reviewsApi = {
  getProductReviews: (productId) => api.get(`/reviews/${productId}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
};

// ─── Cart & Wishlist APIs ──────────────────────────────────────────────────────
export const cartApi = {
  getCart: () => api.get('/cart'),
  syncCart: (cart) => api.put('/cart/sync', { cart }),
  clearCart: () => api.delete('/cart'),
};

export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// ─── Orders APIs ───────────────────────────────────────────────────────────────
export const ordersApi = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  track: (params) => api.get('/orders/track', params),
};

// ─── Contact Form API ──────────────────────────────────────────────────────────
export const contactApi = {
  submit: (formData) => api.post('/contact', formData),
};

// ─── Admin Management APIs ─────────────────────────────────────────────────────
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Products
  getProducts: (params) => api.get('/admin/products', params),
  getProductById: (id) => api.get(`/admin/products/${id}`),
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  adjustStock: (id, quantity) => api.patch(`/admin/products/${id}/stock`, { quantity }),

  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Orders
  getOrders: (params) => api.get('/admin/orders', params),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, statusData) => api.patch(`/admin/orders/${id}/status`, statusData),
  updatePaymentStatus: (id, paymentData) => api.patch(`/admin/orders/${id}/payment`, paymentData),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),

  // Customers
  getCustomers: (params) => api.get('/admin/customers', params),
  getCustomerById: (id) => api.get(`/admin/customers/${id}`),
  updateCustomerStatus: (id, status) => api.patch(`/admin/customers/${id}/status`, { status }),

  // Reviews
  getReviews: (params) => api.get('/admin/reviews', params),
  updateReviewStatus: (id, status) => api.patch(`/admin/reviews/${id}/status`, { status }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),

  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),

  // Delivery
  getDeliveryZones: () => api.get('/admin/delivery'),
  createDeliveryZone: (data) => api.post('/admin/delivery', data),
  updateDeliveryZone: (id, data) => api.put(`/admin/delivery/${id}`, data),
  deleteDeliveryZone: (id) => api.delete(`/admin/delivery/${id}`),

  // Notifications
  getNotifications: () => api.get('/admin/notifications'),
  markNotificationRead: (id) => api.patch(`/admin/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/admin/notifications/read-all'),

  // Staff
  getStaff: () => api.get('/admin/staff'),
  createStaff: (data) => api.post('/admin/staff', data),
  updateStaff: (id, data) => api.put(`/admin/staff/${id}`, data),
  deleteStaff: (id) => api.delete(`/admin/staff/${id}`),

  // Reports & Settings
  getSalesReport: () => api.get('/admin/reports'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

export default api;
