// Orders Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import Modal from '../../admin/components/Modal';
import Pagination from '../../admin/components/Pagination';
import { useAdminToast } from '../../admin/components/AdminToast';
import { mockOrders as initialOrders } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_orders';
const loadOrders = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : initialOrders; } catch { return initialOrders; } };
const saveOrders = (o) => localStorage.setItem(STORAGE_KEY, JSON.stringify(o));

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const Btn = ({ children, onClick, variant = 'primary', style: s }) => {
    const styles = { primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' }, ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' } };
    return <button onClick={onClick} style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', ...styles[variant], ...s }}>{children}</button>;
};

const PAGE_SIZE = 8;

const OrderDetailModal = ({ order, onClose, onUpdateStatus, onUpdatePayment }) => {
    if (!order) return null;
    const [oStatus, setOStatus] = useState(order.orderStatus);
    const [pStatus, setPStatus] = useState(order.paymentStatus);
    const [tracking, setTracking] = useState(order.trackingNo || '');

    const TIMELINE_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStep = TIMELINE_STEPS.indexOf(order.orderStatus);

    return (
        <Modal open onClose={onClose} title={`Order Details — ${order.id}`} width="680px"
            footer={
                <>
                    <Btn variant="ghost" onClick={onClose}>Close</Btn>
                    <Btn onClick={() => { onUpdateStatus(order.id, oStatus, pStatus, tracking); onClose(); }}>💾 Save Changes</Btn>
                </>
            }
        >
            {/* Timeline */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                {TIMELINE_STEPS.map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', background: i <= currentStep ? '#92400e' : '#e5e7eb', color: i <= currentStep ? '#fff' : '#9ca3af', fontWeight: '700' }}>{i <= currentStep ? '✓' : i + 1}</div>
                            <span style={{ fontSize: '10px', color: i <= currentStep ? '#92400e' : '#9ca3af', fontWeight: '600', marginTop: '4px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{step}</span>
                        </div>
                        {i < TIMELINE_STEPS.length - 1 && <div style={{ flex: 1, height: '2px', background: i < currentStep ? '#92400e' : '#e5e7eb', minWidth: '20px' }} />}
                    </div>
                ))}
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Customer</p>
                    <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{order.customer}</p>
                    <p style={{ margin: '2px 0 0', color: '#6b7280' }}>{order.email}</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Delivery Address</p>
                    <p style={{ margin: 0, color: '#374151' }}>{order.deliveryAddress}</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Payment</p>
                    <p style={{ margin: 0, color: '#374151', textTransform: 'capitalize' }}>{order.paymentMethod?.replace('_', ' ')}</p>
                    <StatusBadge status={order.paymentStatus} />
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Order Total</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>${order.total.toFixed(2)}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Subtotal ${order.subtotal.toFixed(2)} + Shipping ${order.shipping.toFixed(2)}</p>
                </div>
            </div>

            {/* Items */}
            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 10px', fontWeight: '700', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Order Items</p>
                {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < order.items.length - 1 ? '1px solid #e5e7eb' : 'none', fontSize: '13px' }}>
                        <span style={{ color: '#374151' }}>{item.name} × {item.qty}</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Update status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Order Status</label>
                    <select value={oStatus} onChange={(e) => setOStatus(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Payment Status</label>
                    <select value={pStatus} onChange={(e) => setPStatus(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Tracking Number</label>
                    <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. TRK-UK-884921" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
            </div>
        </Modal>
    );
};

const Orders = () => {
    const addToast = useAdminToast();
    const [orders, setOrders] = useState(loadOrders);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [viewOrder, setViewOrder] = useState(null);

    const filtered = orders.filter((o) => {
        const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const updateStatus = (id, orderStatus, paymentStatus, trackingNo) => {
        const updated = orders.map((o) => o.id === id ? { ...o, orderStatus, paymentStatus, trackingNo } : o);
        saveOrders(updated); setOrders(updated);
        addToast(`Order ${id} updated`, 'success');
    };

    return (
        <AdminLayout>
            <PageHeader title="Orders" subtitle={`${orders.length} total orders`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Orders' }]} />

            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="🔍  Search by order ID or customer…" style={{ padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '280px' }} />
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                    <option value="all">All Status</option>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto', marginBottom: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                            {['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Action'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No orders found.</td></tr>
                            : paginated.map((o) => (
                                <tr key={o.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#92400e' }}>{o.id}</td>
                                    <td style={{ padding: '12px 14px', color: '#374151' }}>{o.customer}</td>
                                    <td style={{ padding: '12px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{o.date}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>${o.total.toFixed(2)}</td>
                                    <td style={{ padding: '12px 14px' }}><StatusBadge status={o.paymentStatus} /></td>
                                    <td style={{ padding: '12px 14px' }}><StatusBadge status={o.orderStatus} /></td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <Btn variant="ghost" style={{ padding: '5px 12px' }} onClick={() => setViewOrder(o)}>👁️ View</Btn>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination page={page} totalPages={Math.ceil(filtered.length / PAGE_SIZE)} onPage={setPage} />
            </div>

            {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} onUpdateStatus={updateStatus} />}
        </AdminLayout>
    );
};

export default Orders;
