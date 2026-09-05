// Customers Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import Modal from '../../admin/components/Modal';
import Pagination from '../../admin/components/Pagination';
import ConfirmDialog from '../../admin/components/ConfirmDialog';
import { useAdminToast } from '../../admin/components/AdminToast';
import { mockCustomers as initialCustomers, mockOrders } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_customers';
const loadCustomers = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : initialCustomers; } catch { return initialCustomers; } };
const saveCustomers = (c) => localStorage.setItem(STORAGE_KEY, JSON.stringify(c));

const Btn = ({ children, onClick, variant = 'primary', style: s }) => {
    const styles = { primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' }, ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' }, danger: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }, success: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' } };
    return <button onClick={onClick} style={{ padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px', ...styles[variant], ...s }}>{children}</button>;
};

const PAGE_SIZE = 8;

const Customers = () => {
    const addToast = useAdminToast();
    const [customers, setCustomers] = useState(loadCustomers);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [viewCustomer, setViewCustomer] = useState(null);
    const [blockConfirm, setBlockConfirm] = useState(null);

    const filtered = customers.filter((c) => {
        const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const toggleBlock = (customer) => {
        const newStatus = customer.status === 'blocked' ? 'active' : 'blocked';
        const updated = customers.map((c) => c.id === customer.id ? { ...c, status: newStatus } : c);
        saveCustomers(updated); setCustomers(updated);
        addToast(`${customer.name} ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`, newStatus === 'blocked' ? 'error' : 'success');
        setBlockConfirm(null);
    };

    const customerOrders = (customerId) => mockOrders.filter((o) => o.customerId === customerId);

    return (
        <AdminLayout>
            <PageHeader title="Customers" subtitle={`${customers.length} registered customers`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Customers' }]} />

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                {[
                    { label: 'Total', value: customers.length, color: '#0369a1', bg: '#e0f2fe' },
                    { label: 'Active', value: customers.filter((c) => c.status === 'active').length, color: '#166534', bg: '#dcfce7' },
                    { label: 'Blocked', value: customers.filter((c) => c.status === 'blocked').length, color: '#dc2626', bg: '#fee2e2' },
                    { label: 'Total Revenue', value: `$${customers.reduce((s, c) => s + c.totalSpent, 0).toFixed(0)}`, color: '#92400e', bg: '#fef3c7' },
                ].map((c) => (
                    <div key={c.label} style={{ background: c.bg, borderRadius: '12px', padding: '14px 16px' }}>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: c.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</p>
                        <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: '700', color: c.color }}>{c.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="🔍  Search customers…" style={{ padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '240px' }} />
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto', marginBottom: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                            {['Customer', 'Email', 'Country', 'Registered', 'Orders', 'Total Spent', 'Status', 'Actions'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No customers found.</td></tr>
                            : paginated.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#92400e,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>{c.name.charAt(0)}</div>
                                            <span style={{ fontWeight: '500', color: '#111827' }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 14px', color: '#6b7280' }}>{c.email}</td>
                                    <td style={{ padding: '12px 14px', color: '#374151' }}>{c.country}</td>
                                    <td style={{ padding: '12px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{c.registeredAt}</td>
                                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>{c.orders}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>${c.totalSpent.toFixed(2)}</td>
                                    <td style={{ padding: '12px 14px' }}><StatusBadge status={c.status} /></td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <Btn variant="ghost" onClick={() => setViewCustomer(c)}>👁️</Btn>
                                            <Btn variant={c.status === 'blocked' ? 'success' : 'danger'} onClick={() => setBlockConfirm(c)}>
                                                {c.status === 'blocked' ? '✓ Unblock' : '🚫 Block'}
                                            </Btn>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination page={page} totalPages={Math.ceil(filtered.length / PAGE_SIZE)} onPage={setPage} />
            </div>

            {/* Customer detail modal */}
            <Modal open={!!viewCustomer} onClose={() => setViewCustomer(null)} title={`Customer — ${viewCustomer?.name}`} width="580px" footer={<Btn variant="ghost" onClick={() => setViewCustomer(null)}>Close</Btn>}>
                {viewCustomer && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', fontSize: '13px' }}>
                            {[['Email', viewCustomer.email], ['Phone', viewCustomer.phone], ['Country', viewCustomer.country], ['Registered', viewCustomer.registeredAt], ['Orders', viewCustomer.orders], ['Total Spent', `$${viewCustomer.totalSpent.toFixed(2)}`]].map(([k, v]) => (
                                <div key={k} style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 12px' }}>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' }}>{k}</p>
                                    <p style={{ margin: '4px 0 0', fontWeight: '600', color: '#111827' }}>{v}</p>
                                </div>
                            ))}
                        </div>
                        <h4 style={{ margin: '0 0 10px', color: '#374151', fontSize: '13px', fontWeight: '700' }}>Order History</h4>
                        {customerOrders(viewCustomer.id).length === 0 ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No orders yet.</p>
                            : customerOrders(viewCustomer.id).map((o) => (
                                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', marginBottom: '8px', fontSize: '13px' }}>
                                    <div><span style={{ fontWeight: '600', color: '#92400e' }}>{o.id}</span><span style={{ color: '#9ca3af', marginLeft: '8px' }}>{o.date}</span></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <StatusBadge status={o.orderStatus} />
                                        <span style={{ fontWeight: '700', color: '#16a34a' }}>${o.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </Modal>

            <ConfirmDialog open={!!blockConfirm} title={blockConfirm?.status === 'blocked' ? 'Unblock Customer?' : 'Block Customer?'}
                message={blockConfirm?.status === 'blocked' ? `${blockConfirm?.name} will be able to place orders again.` : `${blockConfirm?.name} will no longer be able to log in or place orders.`}
                confirmLabel={blockConfirm?.status === 'blocked' ? 'Unblock' : 'Block'} danger={blockConfirm?.status !== 'blocked'}
                onConfirm={() => toggleBlock(blockConfirm)} onCancel={() => setBlockConfirm(null)}
            />
        </AdminLayout>
    );
};

export default Customers;
