import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { products as initialProducts } from '../data/products';
import { reviews as initialReviews } from '../data/reviews';
import { adminApi } from '../services/api';

const AdminContext = createContext(null);

// ─── Sample seed data ───────────────────────────────────────────────────────

const sampleCustomers = [
  { id: 1, name: 'Sophie Laurent', email: 'sophie@example.com', country: 'France', ordersCount: 5, totalSpent: 189.95, joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'James Whitfield', email: 'james@example.com', country: 'United Kingdom', ordersCount: 3, totalSpent: 124.97, joined: '2024-02-20', status: 'active' },
  { id: 3, name: 'Ananya Krishnan', email: 'ananya@example.com', country: 'Singapore', ordersCount: 7, totalSpent: 312.43, joined: '2023-11-08', status: 'active' },
  { id: 4, name: 'Marco Bianchi', email: 'marco@example.com', country: 'Italy', ordersCount: 2, totalSpent: 79.98, joined: '2024-03-12', status: 'active' },
  { id: 5, name: 'Fatima Al-Mansoori', email: 'fatima@example.com', country: 'UAE', ordersCount: 4, totalSpent: 199.96, joined: '2024-01-30', status: 'active' },
  { id: 6, name: 'Lena Müller', email: 'lena@example.com', country: 'Germany', ordersCount: 1, totalSpent: 34.99, joined: '2024-04-05', status: 'inactive' },
  { id: 7, name: 'David Chen', email: 'david@example.com', country: 'Australia', ordersCount: 6, totalSpent: 267.44, joined: '2023-12-18', status: 'active' },
  { id: 8, name: 'Priya Sharma', email: 'priya@example.com', country: 'India', ordersCount: 3, totalSpent: 98.97, joined: '2024-02-28', status: 'active' },
];

const generateSampleOrders = (products) => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const customers = sampleCustomers;
  const orders = [];
  for (let i = 1; i <= 15; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    for (let j = 0; j < numItems; j++) {
      const prod = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      items.push({ id: prod.id, name: prod.name, price: prod.price, quantity: qty, image: prod.image });
    }
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];
    orders.push({
      id: `PG-${String(10000 + i)}`,
      customer: { name: customer.name, email: customer.email },
      items,
      total: Math.round(total * 100) / 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date,
      shippingAddress: '42 Cinnamon Lane, Galle 80000, Sri Lanka',
      paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
    });
  }
  return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const defaultSettings = {
  storeName: 'PURE GOLD Products',
  email: 'hello@puregoldproducts.com',
  phone: '+94 77 123 4567',
  currency: 'USD',
  address: '42 Cinnamon Lane, Galle 80000, Sri Lanka',
  freeShippingThreshold: 50,
  defaultShippingRate: 9.99,
};

// ─── Reducer ────────────────────────────────────────────────────────────────

const adminReducer = (state, action) => {
  switch (action.type) {
    // Products
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, { ...action.payload, id: action.payload.id || Date.now() }] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    // Orders
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status, orderStatus: action.payload.status } : o),
      };

    // Customers
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };

    // Reviews
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload };
    case 'UPDATE_REVIEW_STATUS':
      return {
        ...state,
        reviews: state.reviews.map(r => r.id === action.payload.id ? { ...r, status: action.payload.status } : r),
      };
    case 'DELETE_REVIEW':
      return { ...state, reviews: state.reviews.filter(r => r.id !== action.payload) };

    // Settings
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    default:
      return state;
  }
};

// ─── Storage helpers ────────────────────────────────────────────────────────

const STORAGE_KEY = 'puregold_admin';

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
};

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
};

// ─── Provider ───────────────────────────────────────────────────────────────

export const AdminProvider = ({ children }) => {
  const existing = loadState();

  const seedProducts = initialProducts.map(p => ({
    ...p,
    image: typeof p.image === 'string' ? p.image : '',
    images: Array.isArray(p.images) ? p.images.filter(i => typeof i === 'string') : [],
  }));

  const initialState = existing || {
    products: seedProducts,
    orders: generateSampleOrders(seedProducts),
    customers: sampleCustomers,
    reviews: initialReviews.map(r => ({ ...r, status: 'approved', avatar: typeof r.avatar === 'string' ? r.avatar : '' })),
    settings: defaultSettings,
  };

  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Sync data with backend on load
  const syncWithBackend = useCallback(async () => {
    try {
      const [ordersRes, productsRes, customersRes, reviewsRes, settingsRes] = await Promise.allSettled([
        adminApi.getOrders({ limit: 50 }),
        adminApi.getProducts({ limit: 50 }),
        adminApi.getCustomers({ limit: 50 }),
        adminApi.getReviews({ limit: 50 }),
        adminApi.getSettings(),
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.success && ordersRes.value.data?.items?.length > 0) {
        const normalizedOrders = ordersRes.value.data.items.map(o => ({
          ...o,
          id: o.orderId || o.id,
          status: o.orderStatus || o.status || 'pending',
          date: o.createdAt ? o.createdAt.split('T')[0] : o.date,
        }));
        dispatch({ type: 'SET_ORDERS', payload: normalizedOrders });
      }

      if (productsRes.status === 'fulfilled' && productsRes.value?.success && productsRes.value.data?.items?.length > 0) {
        dispatch({ type: 'SET_PRODUCTS', payload: productsRes.value.data.items });
      }

      if (customersRes.status === 'fulfilled' && customersRes.value?.success && customersRes.value.data?.items?.length > 0) {
        dispatch({ type: 'SET_CUSTOMERS', payload: customersRes.value.data.items });
      }

      if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.success && reviewsRes.value.data?.items?.length > 0) {
        dispatch({ type: 'SET_REVIEWS', payload: reviewsRes.value.data.items });
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value?.success && settingsRes.value.data) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: settingsRes.value.data });
      }
    } catch (err) {
      console.warn('Backend admin data sync fallback to local store:', err.message);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // Persist on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // ── Computed stats ──
  const stats = {
    totalRevenue: state.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (Number(o.total) || 0), 0),
    totalOrders: state.orders.length,
    totalProducts: state.products.length,
    totalCustomers: state.customers.length,
    pendingOrders: state.orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
    lowStockProducts: state.products.filter(p => (p.stock || 0) <= 30),
    recentOrders: state.orders.slice(0, 5),
    topProducts: [...state.products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5),
    ordersByStatus: {
      pending: state.orders.filter(o => o.status === 'pending').length,
      processing: state.orders.filter(o => o.status === 'processing').length,
      shipped: state.orders.filter(o => o.status === 'shipped').length,
      delivered: state.orders.filter(o => o.status === 'delivered').length,
      cancelled: state.orders.filter(o => o.status === 'cancelled').length,
    },
  };

  const value = {
    ...state,
    stats,
    dispatch,
    refetch: syncWithBackend,
    // Product actions
    addProduct: async (product) => {
      try {
        const res = await adminApi.createProduct(product);
        if (res.success && res.data) {
          dispatch({ type: 'ADD_PRODUCT', payload: res.data });
          return res.data;
        }
      } catch (err) {
        console.warn('Backend addProduct error:', err.message);
      }
      dispatch({ type: 'ADD_PRODUCT', payload: product });
    },
    updateProduct: async (product) => {
      try {
        await adminApi.updateProduct(product.id, product);
      } catch (err) {
        console.warn('Backend updateProduct error:', err.message);
      }
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    },
    deleteProduct: async (id) => {
      try {
        await adminApi.deleteProduct(id);
      } catch (err) {
        console.warn('Backend deleteProduct error:', err.message);
      }
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    },
    // Order actions
    updateOrderStatus: async (id, status) => {
      try {
        await adminApi.updateOrderStatus(id, { orderStatus: status });
      } catch (err) {
        console.warn('Backend updateOrderStatus error:', err.message);
      }
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
    },
    // Review actions
    updateReviewStatus: async (id, status) => {
      try {
        await adminApi.updateReviewStatus(id, status);
      } catch (err) {
        console.warn('Backend updateReviewStatus error:', err.message);
      }
      dispatch({ type: 'UPDATE_REVIEW_STATUS', payload: { id, status } });
    },
    deleteReview: async (id) => {
      try {
        await adminApi.deleteReview(id);
      } catch (err) {
        console.warn('Backend deleteReview error:', err.message);
      }
      dispatch({ type: 'DELETE_REVIEW', payload: id });
    },
    // Settings
    updateSettings: async (settings) => {
      try {
        await adminApi.updateSettings(settings);
      } catch (err) {
        console.warn('Backend updateSettings error:', err.message);
      }
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    },
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

export default AdminContext;
