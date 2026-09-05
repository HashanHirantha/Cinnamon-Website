// Coupons Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import Modal from '../../admin/components/Modal';
import ConfirmDialog from '../../admin/components/ConfirmDialog';
import { useAdminToast } from '../../admin/components/AdminToast';
import { mockCoupons as initialCoupons } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_coupons';
const loadCoupons = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : initialCoupons; } catch { return initialCoupons; } };
const saveCoupons = (c) => localStorage.setItem(STORAGE_KEY, JSON.stringify(c));

const emptyForm = { code: '', type: 'percentage', value: '', minOrder: '', maxDiscount: '', expiry: '', usageLimit: '', status: 'active' };

const Btn = ({ children, onClick, variant = 'primary', style: s }) => {
    const styles = { primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' }, ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' }, danger: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' } };
    return <button onClick={onClick} style={{ padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px', ...styles[variant], ...s }}>{children}</button>;
};

const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' };

const Coupons = () => {
    const addToast = useAdminToast();
    const [coupons, setCoupons] = useState(loadCoupons);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [confirm, setConfirm] = useState(null);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSave = () => {
        if (!form.code.trim() || !form.value) { addToast('Code and discount value are required', 'error'); return; }
        if (modal === 'add') {
            const updated = [...coupons, { ...form, id: Date.now(), usedCount: 0, value: Number(form.value), minOrder: Number(form.minOrder) || 0, maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null, usageLimit: Number(form.usageLimit) || 0, code: form.code.toUpperCase() }];
            saveCoupons(updated); setCoupons(updated);
            addToast(`Coupon "${form.code.toUpperCase()}" created!`, 'success');
        } else {
            const updated = coupons.map((c) => c.id === form.id ? { ...form, value: Number(form.value), minOrder: Number(form.minOrder) || 0, maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null, usageLimit: Number(form.usageLimit) || 0, usedCount: c.usedCount, code: form.code.toUpperCase() } : c);
            saveCoupons(updated); setCoupons(updated);
            addToast('Coupon updated!', 'success');
        }
        setModal(null);
    };

    const handleDelete = () => {
        const updated = coupons.filter((c) => c.id !== confirm.id);
        saveCoupons(updated); setCoupons(updated);
        addToast('Coupon deleted.', 'error');
        setConfirm(null);
    };

    const toggleStatus = (c) => {
        const updated = coupons.map((x) => x.id === c.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x);
        saveCoupons(updated); setCoupons(updated);
    };

    return (
        <AdminLayout>
            <PageHeader title="Coupons" subtitle={`${coupons.length} coupons`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Coupons' }]} actions={<Btn onClick={() => { setForm(emptyForm); setModal('add'); }}>＋ Create Coupon</Btn>} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {coupons.map((c) => {
                    const usagePct = c.usageLimit > 0 ? Math.min(100, (c.usedCount / c.usageLimit) * 100) : 0;
                    const isExpired = c.status === 'expired' || new Date(c.expiry) < new Date();
                    return (
                        <div key={c.id} style={{ background: '#fff', borderRadius: '14px', border: `1px solid ${isExpired ? '#fee2e2' : '#f0f0f0'}`, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', opacity: isExpired ? 0.7 : 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div>
                                    <code style={{ fontSize: '16px', fontWeight: '800', color: '#92400e', background: '#fef3c7', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>{c.code}</code>
                                </div>
                                <StatusBadge status={isExpired ? 'expired' : c.status} />
                            </div>
                            <p style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                                {c.type === 'percentage' ? `${c.value}% OFF` : c.type === 'fixed' ? `$${c.value} OFF` : 'FREE SHIPPING'}
                            </p>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280' }}>Min order: ${c.minOrder} {c.maxDiscount ? `· Max discount: $${c.maxDiscount}` : ''}</p>
                            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#9ca3af' }}>Expires: {c.expiry}</p>
                            {c.usageLimit > 0 && (
                                <div style={{ marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
                                        <span>Usage</span><span>{c.usedCount}/{c.usageLimit}</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                                        <div style={{ height: '100%', background: usagePct > 80 ? '#ef4444' : '#92400e', borderRadius: '3px', width: `${usagePct}%`, transition: 'width 0.3s' }} />
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <Btn variant="ghost" style={{ padding: '5px 10px' }} onClick={() => { setForm({ ...c, maxDiscount: c.maxDiscount ?? '' }); setModal('edit'); }}>✏️ Edit</Btn>
                                <Btn variant={c.status === 'active' ? 'ghost' : 'primary'} style={{ padding: '5px 10px' }} onClick={() => toggleStatus(c)}>{c.status === 'active' ? '⏸' : '▶'}</Btn>
                                <Btn variant="danger" style={{ padding: '5px 10px' }} onClick={() => setConfirm(c)}>🗑️</Btn>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Create Coupon' : 'Edit Coupon'}
                footer={<><Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={handleSave}>💾 Save Coupon</Btn></>}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Coupon Code *</label>
                        <input value={form.code} onChange={set('code')} onBlur={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. WELCOME10" style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Discount Type</label>
                        <select value={form.type} onChange={set('type')} style={inputStyle}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount ($)</option><option value="shipping">Free Shipping</option></select>
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Discount Value *</label>
                        <input type="number" value={form.value} onChange={set('value')} placeholder="10" style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Min Order ($)</label>
                        <input type="number" value={form.minOrder} onChange={set('minOrder')} placeholder="30" style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Max Discount ($)</label>
                        <input type="number" value={form.maxDiscount ?? ''} onChange={set('maxDiscount')} placeholder="Leave blank for no cap" style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Expiry Date</label>
                        <input type="date" value={form.expiry} onChange={set('expiry')} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Usage Limit (0 = unlimited)</label>
                        <input type="number" value={form.usageLimit} onChange={set('usageLimit')} placeholder="100" style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Status</label>
                        <select value={form.status} onChange={set('status')} style={inputStyle}><option value="active">Active</option><option value="inactive">Inactive</option></select>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog open={!!confirm} title="Delete Coupon?" message={`Coupon "${confirm?.code}" will be permanently deleted.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
        </AdminLayout>
    );
};

export default Coupons;
