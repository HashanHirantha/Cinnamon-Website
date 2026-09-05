// Payments Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import Pagination from '../../admin/components/Pagination';
import Modal from '../../admin/components/Modal';
import { useAdminToast } from '../../admin/components/AdminToast';
import { mockPayments } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_payments';
const loadPayments = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : mockPayments; } catch { return mockPayments; } };
const savePayments = (p) => localStorage.setItem(STORAGE_KEY, JSON.stringify(p));

const PAGE_SIZE = 8;

const Payments = () => {
    const addToast = useAdminToast();
    const [payments, setPayments] = useState(loadPayments);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [viewPayment, setViewPayment] = useState(null);

    const filtered = payments.filter((p) => {
        const matchSearch = !search || p.id.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase()) || p.orderId.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const refunded = payments.filter((p) => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);
    const failed = payments.filter((p) => p.status === 'failed').length;

    const METHOD_ICONS = { card: '💳', paypal: '🅿️', bank_transfer: '🏦' };

    return (
        <AdminLayout>
            <PageHeader title="Payments" subtitle="Track all payment transactions" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Payments' }]} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                {[
                    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#166534', bg: '#dcfce7' },
                    { label: 'Successful', value: payments.filter((p) => p.status === 'paid').length, color: '#0369a1', bg: '#e0f2fe' },
                    { label: 'Refunded', value: `$${refunded.toFixed(2)}`, color: '#92400e', bg: '#fef3c7' },
                    { label: 'Failed', value: failed, color: '#dc2626', bg: '#fee2e2' },
                ].map((c) => (
                    <div key={c.label} style={{ background: c.bg, borderRadius: '12px', padding: '16px' }}>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: c.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</p>
                        <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: '700', color: c.color }}>{c.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="🔍  Search payment ID, order, or customer…" style={{ padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '300px' }} />
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                    <option value="all">All Status</option>
                    {['pending', 'paid', 'failed', 'refunded'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto', marginBottom: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                            {['Payment ID', 'Order ID', 'Customer', 'Amount', 'Method', 'Gateway', 'Status', 'Date', 'Details'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? <tr><td colSpan={9} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No payments found.</td></tr>
                            : paginated.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#92400e' }}>{p.id}</td>
                                    <td style={{ padding: '12px 14px', color: '#374151' }}>{p.orderId}</td>
                                    <td style={{ padding: '12px 14px', color: '#374151' }}>{p.customer}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>${p.amount.toFixed(2)}</td>
                                    <td style={{ padding: '12px 14px' }}><span style={{ textTransform: 'capitalize' }}>{METHOD_ICONS[p.method] || '💰'} {p.method.replace('_', ' ')}</span></td>
                                    <td style={{ padding: '12px 14px', color: '#6b7280' }}>{p.gateway}</td>
                                    <td style={{ padding: '12px 14px' }}><StatusBadge status={p.status} /></td>
                                    <td style={{ padding: '12px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{p.date}</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <button onClick={() => setViewPayment(p)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#374151' }}>👁️ View</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination page={page} totalPages={Math.ceil(filtered.length / PAGE_SIZE)} onPage={setPage} />
            </div>

            <Modal open={!!viewPayment} onClose={() => setViewPayment(null)} title={`Payment Details — ${viewPayment?.id}`} footer={<button onClick={() => setViewPayment(null)} style={{ padding: '9px 20px', border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Close</button>}>
                {viewPayment && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                        {[['Payment ID', viewPayment.id], ['Order ID', viewPayment.orderId], ['Customer', viewPayment.customer], ['Amount', `$${viewPayment.amount.toFixed(2)}`], ['Method', viewPayment.method], ['Gateway', viewPayment.gateway], ['Status', viewPayment.status], ['Transaction Date', viewPayment.date]].map(([k, v]) => (
                            <div key={k} style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 12px' }}>
                                <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' }}>{k}</p>
                                <p style={{ margin: '4px 0 0', fontWeight: '600', color: '#111827' }}>{v}</p>
                            </div>
                        ))}
                        <div style={{ gridColumn: '1/-1', background: '#fef3c7', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#92400e' }}>
                            🔒 <strong>Security Notice:</strong> Card numbers, CVV, and sensitive payment details are never stored in the application. All payment processing is handled securely by {viewPayment.gateway}.
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
};

export default Payments;
