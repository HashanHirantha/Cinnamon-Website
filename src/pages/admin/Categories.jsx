// Categories Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import Modal from '../../admin/components/Modal';
import ConfirmDialog from '../../admin/components/ConfirmDialog';
import { useAdminToast } from '../../admin/components/AdminToast';
import { useProducts } from '../../hooks/useProducts';

const STORAGE_KEY = 'ceylon_admin_categories';
const defaultCategories = [
    { id: 1, name: 'Quills', slug: 'quills', image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=200&q=60', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Powder', slug: 'powder', image: 'https://images.unsplash.com/photo-1584975380568-e6e3b3e09f87?w=200&q=60', status: 'active', createdAt: '2024-01-01' },
    { id: 3, name: 'Tea', slug: 'tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&q=60', status: 'active', createdAt: '2024-01-01' },
    { id: 4, name: 'Essential Oils', slug: 'oils', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&q=60', status: 'active', createdAt: '2024-01-01' },
    { id: 5, name: 'Gift Sets', slug: 'gifts', image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=200&q=60', status: 'active', createdAt: '2024-01-01' },
];

const loadCats = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : defaultCategories; } catch { return defaultCategories; } };
const saveCats = (c) => localStorage.setItem(STORAGE_KEY, JSON.stringify(c));

const Btn = ({ children, onClick, variant = 'primary', disabled }) => {
    const s = { primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' }, danger: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }, ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' } };
    return <button onClick={onClick} disabled={disabled} style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', ...s[variant] }}>{children}</button>;
};

const Categories = () => {
    const { products } = useProducts();
    const addToast = useAdminToast();
    const [cats, setCats] = useState(loadCats);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ name: '', slug: '', image: '', status: 'active' });
    const [confirm, setConfirm] = useState(null);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const openAdd = () => { setForm({ name: '', slug: '', image: '', status: 'active' }); setModal('add'); };
    const openEdit = (cat) => { setForm({ ...cat }); setModal('edit'); };

    const productCount = (slug) => products.filter((p) => p.category === slug).length;

    const handleSave = () => {
        if (!form.name.trim()) { addToast('Name is required', 'error'); return; }
        const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
        if (modal === 'add') {
            const updated = [...cats, { ...form, slug, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }];
            saveCats(updated); setCats(updated);
            addToast(`Category "${form.name}" added!`, 'success');
        } else {
            const updated = cats.map((c) => c.id === form.id ? { ...form, slug } : c);
            saveCats(updated); setCats(updated);
            addToast(`Category "${form.name}" updated!`, 'success');
        }
        setModal(null);
    };

    const handleDelete = () => {
        const updated = cats.filter((c) => c.id !== confirm.id);
        saveCats(updated); setCats(updated);
        addToast(`"${confirm.name}" deleted.`, 'error');
        setConfirm(null);
    };

    const toggleStatus = (cat) => {
        const updated = cats.map((c) => c.id === cat.id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c);
        saveCats(updated); setCats(updated);
        addToast(`${cat.name} ${cat.status === 'active' ? 'deactivated' : 'activated'}`, 'success');
    };

    const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' };

    return (
        <AdminLayout>
            <PageHeader title="Categories" subtitle={`${cats.length} categories`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Categories' }]} actions={<Btn onClick={openAdd}>＋ Add Category</Btn>} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {cats.map((cat) => (
                    <div key={cat.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        {cat.image && <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />}
                        <div style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>{cat.name}</h3>
                                <StatusBadge status={cat.status} />
                            </div>
                            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#9ca3af' }}>Slug: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{cat.slug}</code></p>
                            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#6b7280' }}>{productCount(cat.slug)} products · Added {cat.createdAt}</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Btn variant="ghost" onClick={() => openEdit(cat)}>✏️ Edit</Btn>
                                <Btn variant={cat.status === 'active' ? 'ghost' : 'primary'} onClick={() => toggleStatus(cat)}>{cat.status === 'active' ? '⏸ Deactivate' : '▶ Activate'}</Btn>
                                <Btn variant="danger" onClick={() => setConfirm(cat)}>🗑️</Btn>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Category' : 'Edit Category'} footer={<><Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={handleSave}>💾 Save</Btn></>}>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Category Name *</label>
                    <input value={form.name} onChange={set('name')} placeholder="e.g. Quills" style={inputStyle} />
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Slug (auto-generated if blank)</label>
                    <input value={form.slug} onChange={set('slug')} placeholder="e.g. quills" style={inputStyle} />
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Image URL</label>
                    <input value={form.image} onChange={set('image')} placeholder="https://..." style={inputStyle} />
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Status</label>
                    <select value={form.status} onChange={set('status')} style={{ ...inputStyle }}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </Modal>

            <ConfirmDialog open={!!confirm} title="Delete Category?" message={`"${confirm?.name}" will be permanently deleted. Products in this category will NOT be deleted.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
        </AdminLayout>
    );
};

export default Categories;
