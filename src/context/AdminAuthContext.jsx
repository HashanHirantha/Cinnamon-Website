// Enhanced Admin Auth Context with backend API connection and fallback
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ROLE_PERMISSIONS } from '../admin/data/mockData';
import { adminAuthApi } from '../services/api';

const AdminAuthContext = createContext(null);

const ADMIN_CREDENTIALS = [
  { id: 'staff-admin-01', username: 'admin', password: 'ceylon@2025', role: 'superadmin', displayName: 'Hashan Hirantha (Admin)', email: 'admin@ceyloncinnamon.com' },
  { id: 'staff-products-02', username: 'products', password: 'products@2025', role: 'product_manager', displayName: 'Nimal Perera', email: 'products@ceyloncinnamon.com' },
  { id: 'staff-orders-03', username: 'orders', password: 'orders@2025', role: 'order_manager', displayName: 'Kasun Silva', email: 'orders@ceyloncinnamon.com' },
  { id: 'staff-support-04', username: 'support', password: 'support@2025', role: 'customer_support', displayName: 'Dilani Fernando', email: 'support@ceyloncinnamon.com' },
];

const STORAGE_KEY = 'ceylon_admin_session';
const TOKEN_KEY = 'ceylone_admin_token';

const loadAdminSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(loadAdminSession);

  // Validate admin session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const res = await adminAuthApi.getProfile();
          if (res.success && res.data) {
            setAdminUser(res.data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Admin token validation fallback:', err.message);
        }
      }
    };
    checkSession();
  }, []);

  const adminLogin = useCallback(async (username, password) => {
    try {
      const res = await adminAuthApi.login({ username, password });
      if (res.success && res.data) {
        const { admin, token } = res.data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
        localStorage.setItem(TOKEN_KEY, token);
        setAdminUser(admin);
        return { success: true, role: admin.role };
      }
    } catch (apiError) {
      console.warn('Backend login error or offline — checking local credentials fallback:', apiError.message);
      // Fallback for offline development
      const match = ADMIN_CREDENTIALS.find(
        (c) => (c.username === username.trim() || c.email === username.trim()) && c.password === password
      );
      if (match) {
        const session = {
          id: match.id,
          username: match.username,
          displayName: match.displayName,
          email: match.email,
          role: match.role,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setAdminUser(session);
        return { success: true, role: match.role };
      }
      return {
        success: false,
        message: apiError.data?.message || 'Invalid credentials. Access denied.',
      };
    }
    return { success: false, message: 'Invalid credentials. Access denied.' };
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setAdminUser(null);
  }, []);

  const isAdmin = !!adminUser;

  const hasPermission = useCallback(
    (section) => {
      if (!adminUser) return false;
      const perms = ROLE_PERMISSIONS[adminUser.role] || [];
      return perms.includes('*') || perms.includes(section);
    },
    [adminUser]
  );

  return (
    <AdminAuthContext.Provider value={{ adminUser, adminLogin, adminLogout, isAdmin, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
