// Inventory Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import Modal from '../../admin/components/Modal';
import { useAdminToast } from '../../admin/components/AdminToast';
import { useProducts } from '../../hooks/useProducts';

const Btn = ({ children, onClick, variant = 'primary', style: s }) => {
    const styles = { primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' }, ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' } };
    return <button onClick={onClick} style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', ...styles[variant], ...s }}>{children}</button>;
};

const getStockStatus = (stock, min = 20) => {
    if (stock === 0) return 'out of stock';
    if (stock < min) return 'low stock';
    return 'in stock';
};

const Inventory = () => {
    const { products, updateProduct } = useProducts();
    const addToast = useAdminToast();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [adjustModal, setAdjustModal] = useState(null);
    const [adjustVal, setAdjustVal] = useState('');
    const [adjustNote, setAdjustNote] = useState('');

    const filtered = products.filter((p) => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
        const status = getStockStatus(p.stock, p.minStock || 20);
        const matchFilter = filter === 'all' || status === filter;
        return matchSearch && matchFilter;
    });

    const handleAdjust = () => {
        const qty = parseInt(adjustVal, 10);
        if (isNaN(qty)) { addToast('Enter a valid quantity', 'error'); return; }
        const newStock = Math.max(0, (adjustModal.stock || 0) + qty);
        updateProduct(adjustModal.id, { stock: newStock, inStock: newStock > 0 });
        addToast(`Stock for "${adjustModal.name}" updated to ${newStock}`, 'success');
        setAdjustModal(null); setAdjustVal(''); setAdjustNote('');
    };

    const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' };

    return (
        <AdminLayout>
            <PageHeader title="Inventory" subtitle="Track and manage product stock levels" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Inventory' }]} />

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                {[
                    { label: 'Total Products', value: products.length, color: '#0369a1', bg: '#e0f2fe' },
                    { label: 'In Stock', value: products.filter((p) => getStockStatus(p.stock) === 'in stock').length, color: '#166534', bg: '#dcfce7' },
                    { label: 'Low Stock', value: products.filter((p) => getStockStatus(p.stock, p.minStock || 20) === 'low stock').length, color: '#92400e', bg: '#fef3c7' },
                    { label: 'Out of Stock', value: products.filter((p) => p.stock === 0).length, color: '#dc2626', bg: '#fee2e2' },
                ].map((c) => (
                    <div key={c.label} style={{ background: c.bg, borderRadius: '12px', padding: '16px 18px' }}>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: c.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</p>
                        <p style={{ margin: '6px 0 0', fontSize: '28px', fontWeight: '700', color: c.color }}>{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Search product or SKU…" style={{ padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '240px' }} />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                    <option value="all">All Status</option>
                    <option value="in stock">In Stock</option>
                    <option value="low stock">Low Stock</option>
                    <option value="out of stock">Out of Stock</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                            {['Product', 'SKU', 'Category', 'Current Stock', 'Min Stock', 'Stock Status', 'Actions'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No products found.</td></tr>
                        ) : filtered.map((p) => {
                            const minStock = p.minStock || 20;
                            const status = getStockStatus(p.stock, minStock);
                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb', background: status === 'out of stock' ? '#fff7f7' : status === 'low stock' ? '#fffdf0' : '#fff' }}>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {p.image && <img src={p.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '7px', objectFit: 'cover' }} />}
                                            <span style={{ fontWeight: '500', color: '#111827' }}>{p.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 14px', color: '#9ca3af' }}>{p.sku || '–'}</td>
                                    <td style={{ padding: '12px 14px', textTransform: 'capitalize', color: '#374151' }}>{p.category}</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: status === 'out of stock' ? '#dc2626' : status === 'low stock' ? '#d97706' : '#111827' }}>{p.stock}</span>
                                    </td>
                                    <td style={{ padding: '12px 14px', color: '#6b7280' }}>{minStock}</td>
                                    <td style={{ padding: '12px 14px' }}><StatusBadge status={status} /></td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <Btn variant="ghost" style={{ padding: '6px 12px' }} onClick={() => { setAdjustModal(p); setAdjustVal(''); setAdjustNote(''); }}>📝 Adjust</Btn>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Adjust Modal */}
            <Modal open={!!adjustModal} onClose={() => setAdjustModal(null)} title={`Adjust Stock — ${adjustModal?.name}`}
                footer={<><Btn variant="ghost" onClick={() => setAdjustModal(null)}>Cancel</Btn><Btn onClick={handleAdjust}>Update Stock</Btn></>}>
                <div>
                    <p style={{ margin: '0 0 14px', color: '#6b7280', fontSize: '14px' }}>Current stock: <strong style={{ color: '#111827' }}>{adjustModal?.stock}</strong></p>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Quantity Adjustment (use negative to subtract) *</label>
                    <input type="number" value={adjustVal} onChange={(e) => setAdjustVal(e.target.value)} placeholder="e.g. +50 or -10" style={inputStyle} />
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Note / Reason</label>
                    <input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} placeholder="e.g. Received new shipment" style={inputStyle} />
                    {adjustVal && !isNaN(parseInt(adjustVal, 10)) && (
                        <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#166534', background: '#f0fdf4', padding: '8px 12px', borderRadius: '8px' }}>
                            New stock: <strong>{Math.max(0, (adjustModal?.stock || 0) + parseInt(adjustVal, 10))}</strong>
                        </p>
                    )}
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default Inventory;
