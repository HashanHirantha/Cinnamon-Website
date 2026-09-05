// Notifications Center Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import { mockNotifications as initialNotifs } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_notifications';
const loadNotifs = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : initialNotifs; } catch { return initialNotifs; } };
const saveNotifs = (n) => localStorage.setItem(STORAGE_KEY, JSON.stringify(n));

const TYPE_LABELS = { order: 'Order', payment: 'Payment', stock: 'Stock', customer: 'Customer', review: 'Review' };
const TYPE_COLORS = { order: '#0369a1', payment: '#166534', stock: '#d97706', customer: '#7c3aed', review: '#9d174d' };
const TYPE_BGS = { order: '#e0f2fe', payment: '#dcfce7', stock: '#fef3c7', customer: '#ede9fe', review: '#fce7f3' };

const Notifs = () => {
    const [notifs, setNotifs] = useState(loadNotifs);
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter((n) => !n.read) : notifs.filter((n) => n.type === filter);

    const markAllRead = () => {
        const updated = notifs.map((n) => ({ ...n, read: true }));
        saveNotifs(updated); setNotifs(updated);
    };

    const markRead = (id) => {
        const updated = notifs.map((n) => n.id === id ? { ...n, read: true } : n);
        saveNotifs(updated); setNotifs(updated);
    };

    const deleteNotif = (id) => {
        const updated = notifs.filter((n) => n.id !== id);
        saveNotifs(updated); setNotifs(updated);
    };

    const unread = notifs.filter((n) => !n.read).length;

    const formatTime = (iso) => {
        const d = new Date(iso);
        const now = new Date('2026-09-05T13:00:00');
        const diff = Math.round((now - d) / 60000);
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Notifications"
                subtitle={`${unread} unread notifications`}
                breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Notifications' }]}
                actions={unread > 0 ? <button onClick={markAllRead} style={{ padding: '8px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>✓ Mark all read</button> : null}
            />

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['all', 'unread', 'order', 'payment', 'stock', 'customer', 'review'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '13px', fontWeight: '500', textTransform: 'capitalize', background: filter === f ? '#92400e' : '#fff', color: filter === f ? '#fff' : '#6b7280', borderColor: filter === f ? '#92400e' : '#e5e7eb' }}>
                        {f === 'unread' && unread > 0 ? `Unread (${unread})` : f}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', color: '#9ca3af', border: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '36px', margin: '0 0 8px' }}>🔔</p>
                        <p style={{ margin: 0 }}>No notifications here.</p>
                    </div>
                ) : filtered.map((n) => (
                    <div key={n.id} style={{
                        background: n.read ? '#fff' : '#fffbeb', borderRadius: '12px', padding: '16px 18px',
                        border: `1px solid ${n.read ? '#f0f0f0' : '#fde68a'}`,
                        display: 'flex', alignItems: 'flex-start', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: TYPE_BGS[n.type] || '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                            {n.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '14px', fontWeight: n.read ? '500' : '700', color: '#111827' }}>{n.title}</span>
                                <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: TYPE_BGS[n.type], color: TYPE_COLORS[n.type] }}>{TYPE_LABELS[n.type]}</span>
                                {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />}
                            </div>
                            <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: '13px' }}>{n.message}</p>
                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{formatTime(n.time)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            {!n.read && <button onClick={() => markRead(n.id)} style={{ padding: '5px 10px', border: '1px solid #e5e7eb', background: '#fff', borderRadius: '7px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: '#374151' }}>Read</button>}
                            <button onClick={() => deleteNotif(n.id)} style={{ padding: '5px 10px', border: '1px solid #fecaca', background: '#fee2e2', borderRadius: '7px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: '#dc2626' }}>✕</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default Notifs;
