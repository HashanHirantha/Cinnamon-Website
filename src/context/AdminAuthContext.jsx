// Enhanced Admin Auth Context with role-based permissions
import { createContext, useContext, useState, useCallback } from 'react';
import { ROLE_PERMISSIONS, mockStaff } from '../admin/data/mockData';

const AdminAuthContext = createContext(null);

const ADMIN_CREDENTIALS = [
    { id: 1, username: 'admin', password: 'ceylon@2025', role: 'superadmin', displayName: 'Hashan Hirantha', email: 'admin@ceyloncinnamon.com' },
    { id: 2, username: 'products', password: 'products@2025', role: 'product_manager', displayName: 'Nimal Perera', email: 'products@ceyloncinnamon.com' },
    { id: 3, username: 'orders', password: 'orders@2025', role: 'order_manager', displayName: 'Kasun Silva', email: 'orders@ceyloncinnamon.com' },
    { id: 4, username: 'support', password: 'support@2025', role: 'customer_support', displayName: 'Dilani Fernando', email: 'support@ceyloncinnamon.com' },
];

const STORAGE_KEY = 'ceylon_admin_session';

const loadAdminSession = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

export const AdminAuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(loadAdminSession);

    const adminLogin = useCallback((username, password) => {
        const match = ADMIN_CREDENTIALS.find(
            (c) => (c.username === username.trim() || c.email === username.trim()) && c.password === password
        );
        if (match) {
            const session = { id: match.id, username: match.username, displayName: match.displayName, email: match.email, role: match.role };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
            setAdminUser(session);
            return { success: true, role: match.role };
        }
        return { success: false, message: 'Invalid credentials. Access denied.' };
    }, []);

    const adminLogout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAdminUser(null);
    }, []);

    const isAdmin = !!adminUser;

    const hasPermission = useCallback((section) => {
        if (!adminUser) return false;
        const perms = ROLE_PERMISSIONS[adminUser.role] || [];
        return perms.includes('*') || perms.includes(section);
    }, [adminUser]);

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
