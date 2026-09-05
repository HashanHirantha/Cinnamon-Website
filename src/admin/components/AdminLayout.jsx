// Admin Layout — Sidebar + Top Navigation Bar
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminToast } from './AdminToast';
import { mockNotifications } from '../data/mockData';

const NAV_ITEMS = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠', perm: null },
    { path: '/admin/products', label: 'Products', icon: '📦', perm: 'products' },
    { path: '/admin/categories', label: 'Categories', icon: '🏷️', perm: 'categories' },
    { path: '/admin/inventory', label: 'Inventory', icon: '📊', perm: 'inventory' },
    { path: '/admin/orders', label: 'Orders', icon: '🛍️', perm: 'orders' },
    { path: '/admin/customers', label: 'Customers', icon: '👥', perm: 'customers' },
    { path: '/admin/payments', label: 'Payments', icon: '💳', perm: null },
    { path: '/admin/delivery', label: 'Delivery', icon: '🚚', perm: 'delivery' },
    { path: '/admin/coupons', label: 'Coupons', icon: '🎟️', perm: null },
    { path: '/admin/reviews', label: 'Reviews', icon: '⭐', perm: 'reviews' },
    { path: '/admin/reports', label: 'Reports', icon: '📈', perm: null },
    { path: '/admin/notifications', label: 'Notifications', icon: '🔔', perm: null },
    { path: '/admin/staff', label: 'Staff', icon: '👤', perm: null },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️', perm: null },
];

const ROLE_LABELS = {
    superadmin: 'Super Admin',
    product_manager: 'Product Manager',
    order_manager: 'Order Manager',
    customer_support: 'Customer Support',
};

const AdminLayout = ({ children }) => {
    const { adminUser, adminLogout, hasPermission } = useAdminAuth();
    const addToast = useAdminToast();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const unread = mockNotifications.filter((n) => !n.read).length;

    const handleLogout = () => {
        adminLogout();
        addToast('Logged out successfully', 'success');
        navigate('/admin/login');
    };

    const sidebarWidth = collapsed ? '64px' : '220px';

    const SidebarContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo */}
            <div style={{ padding: collapsed ? '20px 0' : '20px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f5f0e820' }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>🌿</span>
                {!collapsed && <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden' }}>Ceylon Admin</span>}
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, paddingTop: '8px', overflowY: 'auto' }}>
                {NAV_ITEMS.map((item) => {
                    const allowed = item.perm === null || hasPermission(item.perm) || adminUser?.role === 'superadmin';
                    if (!allowed) return null;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: collapsed ? '11px' : '10px 16px',
                                textDecoration: 'none', transition: 'all 0.15s',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                                borderRight: isActive ? '3px solid #d97706' : '3px solid transparent',
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                            })}
                            title={collapsed ? item.label : undefined}
                        >
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                            {!collapsed && <span style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap' }}>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User profile */}
            <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!collapsed && adminUser && (
                    <div style={{ marginBottom: '4px' }}>
                        <p style={{ margin: 0, color: '#fff', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminUser.displayName}</p>
                        <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{ROLE_LABELS[adminUser.role]}</p>
                    </div>
                )}
                <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: '8px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '500',
                }}>
                    <span>🚪</span>
                    {!collapsed && 'Sign Out'}
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Inter', sans-serif" }}>
            {/* Desktop Sidebar */}
            <aside style={{
                width: sidebarWidth, background: 'linear-gradient(170deg,#1a0a02,#2d1505)', flexShrink: 0,
                position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden',
                zIndex: 200, transition: 'width 0.25s ease', display: 'none',
            }} className="admin-sidebar">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setMobileOpen(false)} />
                    <div style={{ width: '220px', background: 'linear-gradient(170deg,#1a0a02,#2d1505)', height: '100%', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Main content area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-main">
                {/* Top Navigation Bar */}
                <header style={{
                    height: '60px', background: '#fff', borderBottom: '1px solid #f0f0f0',
                    display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px',
                    position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
                }}>
                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '6px', borderRadius: '6px', color: '#374151' }}
                        className="mobile-menu-btn"
                    >☰</button>

                    {/* Collapse toggle (desktop) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '6px', borderRadius: '6px', color: '#374151' }}
                        className="collapse-btn"
                    >{collapsed ? '→' : '←'}</button>

                    {/* Breadcrumb / Page title */}
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            <span style={{ color: '#92400e', fontWeight: '600' }}>Ceylon Admin</span>
                        </span>
                    </div>

                    {/* Notifications */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '6px', position: 'relative', borderRadius: '8px' }}
                        >
                            🔔
                            {unread > 0 && (
                                <span style={{
                                    position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px',
                                    background: '#ef4444', color: '#fff', borderRadius: '50%', fontSize: '10px',
                                    fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {unread}
                                </span>
                            )}
                        </button>
                        {notifOpen && (
                            <div style={{
                                position: 'absolute', right: 0, top: '100%', background: '#fff', borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #f0f0f0', minWidth: '320px',
                                maxHeight: '400px', overflowY: 'auto', zIndex: 200,
                            }}>
                                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: '700', fontSize: '14px', color: '#111827' }}>
                                    Notifications {unread > 0 && <span style={{ color: '#ef4444', marginLeft: '4px' }}>({unread})</span>}
                                </div>
                                {mockNotifications.slice(0, 5).map((n) => (
                                    <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f9fafb', background: n.read ? '#fff' : '#fefce8', display: 'flex', gap: '10px', }}>
                                        <span style={{ fontSize: '18px' }}>{n.icon}</span>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: n.read ? '400' : '600', color: '#111827' }}>{n.title}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>{n.message}</p>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                                    <a href="/admin/notifications" style={{ color: '#92400e', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>View all notifications →</a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin avatar */}
                    {adminUser && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#92400e,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                                {adminUser.displayName?.charAt(0)}
                            </div>
                            <div style={{ display: 'none' }} className="admin-name-text">
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#111827' }}>{adminUser.displayName}</p>
                            </div>
                        </div>
                    )}
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @media (min-width: 768px) {
          .admin-sidebar { display: block !important; }
          .admin-main { margin-left: ${sidebarWidth}; transition: margin-left 0.25s ease; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .admin-main { margin-left: 0 !important; }
          .collapse-btn { display: none !important; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
      `}</style>
        </div>
    );
};

export default AdminLayout;
