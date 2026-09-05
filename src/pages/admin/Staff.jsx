// Staff / Admin Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import Modal from '../../admin/components/Modal';
import ConfirmDialog from '../../admin/components/ConfirmDialog';
import { useAdminToast } from '../../admin/components/AdminToast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { mockStaff as initialStaff, ROLE_PERMISSIONS } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_staff';
const loadStaff = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : initialStaff; } catch { return initialStaff; } };
const saveStaff = (s) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

const ROLES = [
    { key: 'superadmin', label: 'Super Admin', desc: 'Full access to all features' },
    { key: 'product_manager', label: 'Product Manager', desc: 'Products, Categories, Inventory' },
    { key: 'order_manager', label: 'Order Manager', desc: 'Orders, Customers, Delivery' },
    { key: 'customer_support', label: 'Customer Support', desc: 'Customers, Orders, Reviews' },
];

const emptyForm = { name: '', email: '', role: 'product_manager', status: 'active' };

const Btn = ({ children, onClick, variant = 'primary', disabled, style: s }) => {
    const styles = { primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' }, ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' }, danger: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' } };
    return <button onClick={onClick} disabled={disabled} style={{ padding: '8px 14px', borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: disabled ? 0.5 : 1, ...styles[variant], ...s }}>{children}</button>;
};

const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' };

const Staff = () => {
    const { adminUser } = useAdminAuth();
    const addToast = useAdminToast();
    const [staff, setStaff] = useState(loadStaff);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [confirm, setConfirm] = useState(null);
    const isSuperAdmin = adminUser?.role === 'superadmin';

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSave = () => {
        if (!form.name.trim() || !form.email.trim()) { addToast('Name and email are required', 'error'); return; }
        if (modal === 'add') {
            const updated = [...staff, { ...form, id: Date.now(), createdAt: new Date().toISOString().split('T')[0], lastLogin: '—', avatar: null }];
            saveStaff(updated); setStaff(updated);
            addToast(`Staff member "${form.name}" added!`, 'success');
        } else {
            const updated = staff.map((s) => s.id === form.id ? { ...s, ...form } : s);
            saveStaff(updated); setStaff(updated);
            addToast('Staff member updated!', 'success');
        }
        setModal(null);
    };

    const handleDelete = () => {
        if (confirm.id === 1) { addToast('Cannot delete the primary super admin account.', 'error'); setConfirm(null); return; }
        const updated = staff.filter((s) => s.id !== confirm.id);
        saveStaff(updated); setStaff(updated);
        addToast('Staff member removed.', 'error');
        setConfirm(null);
    };

    const PERM_COLORS = { products: '#0369a1', categories: '#7c3aed', inventory: '#0891b2', orders: '#d97706', customers: '#92400e', delivery: '#166534', reviews: '#9d174d', '*': '#374151' };

    return (
        <AdminLayout>
            <PageHeader title="Staff & Admins" subtitle={`${staff.length} team members`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Staff' }]}
                actions={isSuperAdmin ? <Btn onClick={() => { setForm(emptyForm); setModal('add'); }}>＋ Add Staff</Btn> : null}
            />

            {!isSuperAdmin && (
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400e' }}>
                    ⚠️ Only Super Admins can create or delete staff accounts and change permissions.
                </div>
            )}

            {/* Role overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {ROLES.map((r) => (
                    <div key={r.key} style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#111827' }}>{r.label}</h4>
                            <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: '600' }}>{staff.filter((s) => s.role === r.key).length}</span>
                        </div>
                        <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '12px' }}>{r.desc}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {ROLE_PERMISSIONS[r.key].map((p) => (
                                <span key={p} style={{ background: '#f3f4f6', color: '#374151', borderRadius: '6px', padding: '2px 7px', fontSize: '10px', fontWeight: '600', textTransform: p === '*' ? 'uppercase' : 'capitalize' }}>{p === '*' ? 'All Access' : p}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Staff list */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                            {['Staff Member', 'Email', 'Role', 'Status', 'Created', 'Last Login', 'Actions'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((s) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                <td style={{ padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#92400e,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>{s.name.charAt(0)}</div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{s.name}</p>
                                            {s.id === adminUser?.id && <span style={{ fontSize: '11px', color: '#92400e', fontWeight: '600' }}>You</span>}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 14px', color: '#6b7280' }}>{s.email}</td>
                                <td style={{ padding: '12px 14px' }}><StatusBadge status={s.role} /></td>
                                <td style={{ padding: '12px 14px' }}><StatusBadge status={s.status} /></td>
                                <td style={{ padding: '12px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{s.createdAt}</td>
                                <td style={{ padding: '12px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{s.lastLogin}</td>
                                <td style={{ padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <Btn variant="ghost" style={{ padding: '5px 10px' }} disabled={!isSuperAdmin} onClick={() => { setForm({ ...s }); setModal('edit'); }}>✏️</Btn>
                                        <Btn variant="danger" style={{ padding: '5px 10px' }} disabled={!isSuperAdmin || s.id === adminUser?.id} onClick={() => setConfirm(s)}>🗑️</Btn>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Staff Member' : 'Edit Staff Member'}
                footer={<><Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={handleSave}>💾 Save</Btn></>}>
                <div>
                    {[['Full Name *', 'name', 'e.g. Kasun Silva'], ['Email *', 'email', 'e.g. kasun@ceyloncinnamon.com']].map(([label, key, ph]) => (
                        <div key={key}>
                            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
                            <input value={form[key] || ''} onChange={set(key)} placeholder={ph} style={inputStyle} />
                        </div>
                    ))}
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Role</label>
                    <select value={form.role} onChange={set('role')} style={inputStyle}>{ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}</select>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Status</label>
                    <select value={form.status} onChange={set('status')} style={inputStyle}><option value="active">Active</option><option value="inactive">Inactive</option></select>
                </div>
            </Modal>

            <ConfirmDialog open={!!confirm} title="Remove Staff Member?" message={`"${confirm?.name}" will lose access to the admin dashboard.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
        </AdminLayout>
    );
};

export default Staff;
