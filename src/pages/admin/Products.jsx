// Products Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import ConfirmDialog from '../../admin/components/ConfirmDialog';
import Modal from '../../admin/components/Modal';
import Pagination from '../../admin/components/Pagination';
import { useAdminToast } from '../../admin/components/AdminToast';
import { useProducts } from '../../hooks/useProducts';

const CATEGORIES = ['quills', 'powder', 'tea', 'oils', 'gifts'];

const emptyForm = { name: '', sku: '', shortDescription: '', description: '', category: 'quills', image: '', price: '', originalPrice: '', stock: '', minStock: '20', weight: '', origin: '', ingredients: '', processing: '', badge: '', inStock: true, featured: false, tags: '', status: 'active' };

const Btn = ({ children, onClick, variant = 'primary', style: s, disabled }) => {
    const styles = {
        primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' },
        danger: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' },
        ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' },
        success: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
    };
    return <button onClick={onClick} disabled={disabled} style={{ padding: '8px 16px', borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: disabled ? 0.5 : 1, ...styles[variant], ...s }}>{children}</button>;
};

const Field = ({ label, children, required }) => (
    <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
        {children}
    </div>
);

const Input = ({ value, onChange, placeholder, type = 'text', style: s }) => (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box', ...s }} />
);

const ProductForm = ({ initial = emptyForm, onSave, onClose }) => {
    const [form, setForm] = useState({ ...emptyForm, ...initial, tags: Array.isArray(initial?.tags) ? initial.tags.join(', ') : (initial?.tags || ''), price: initial?.price ? String(initial.price) : '', originalPrice: initial?.originalPrice ? String(initial.originalPrice) : '', stock: initial?.stock ? String(initial.stock) : '' });

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const handleSave = () => {
        if (!form.name || !form.price || !form.stock) { alert('Name, price, and stock are required.'); return; }
        onSave({ ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, stock: Number(form.stock), minStock: Number(form.minStock) || 20, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean), images: form.image ? [form.image] : [], slug: form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), badge: form.badge || null });
    };

    const inputCls = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box' };
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div style={{ gridColumn: '1/-1' }}><Field label="Product Name" required><Input value={form.name} onChange={set('name')} placeholder="e.g. Ceylon Cinnamon Quills" /></Field></div>
            <Field label="SKU"><Input value={form.sku} onChange={set('sku')} placeholder="e.g. CCQ-001" /></Field>
            <Field label="Category" required>
                <select value={form.category} onChange={set('category')} style={{ ...inputCls, cursor: 'pointer' }}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            </Field>
            <div style={{ gridColumn: '1/-1' }}><Field label="Short Description"><Input value={form.shortDescription} onChange={set('shortDescription')} placeholder="One-line summary" /></Field></div>
            <div style={{ gridColumn: '1/-1' }}><Field label="Description"><textarea value={form.description} onChange={set('description')} rows={3} placeholder="Detailed description" style={{ ...inputCls, resize: 'vertical', fontFamily: 'inherit' }} /></Field></div>
            <div style={{ gridColumn: '1/-1' }}><Field label="Image URL"><Input value={form.image} onChange={set('image')} placeholder="https://images.unsplash.com/..." /></Field></div>
            <Field label="Price ($)" required><Input type="number" value={form.price} onChange={set('price')} placeholder="0.00" /></Field>
            <Field label="Original Price ($)"><Input type="number" value={form.originalPrice} onChange={set('originalPrice')} placeholder="Leave blank if no discount" /></Field>
            <Field label="Stock Quantity" required><Input type="number" value={form.stock} onChange={set('stock')} placeholder="0" /></Field>
            <Field label="Min Stock Level"><Input type="number" value={form.minStock} onChange={set('minStock')} placeholder="20" /></Field>
            <Field label="Weight / Size"><Input value={form.weight} onChange={set('weight')} placeholder="e.g. 100g" /></Field>
            <Field label="Origin"><Input value={form.origin} onChange={set('origin')} placeholder="e.g. Galle, Sri Lanka" /></Field>
            <Field label="Badge (optional)"><Input value={form.badge} onChange={set('badge')} placeholder="e.g. Best Seller, New, Organic" /></Field>
            <Field label="Tags (comma-separated)"><Input value={form.tags} onChange={set('tags')} placeholder="quills, premium, gift-worthy" /></Field>
            <Field label="In Stock">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.inStock} onChange={set('inStock')} style={{ accentColor: '#92400e' }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Product available for purchase</span>
                </label>
            </Field>
            <Field label="Featured">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.featured} onChange={set('featured')} style={{ accentColor: '#92400e' }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Show on homepage</span>
                </label>
            </Field>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
                <Btn onClick={handleSave}>💾 Save Product</Btn>
            </div>
        </div>
    );
};

const PAGE_SIZE = 8;

const Products = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const addToast = useAdminToast();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
    const [editing, setEditing] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const filtered = products.filter((p) => {
        const matchCat = category === 'all' || p.category === category;
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const handleAdd = (data) => {
        addProduct(data);
        addToast(`"${data.name}" added!`, 'success');
        setModalMode(null);
    };
    const handleEdit = (data) => {
        updateProduct(editing.id, data);
        addToast(`"${data.name}" updated!`, 'success');
        setEditing(null); setModalMode(null);
    };
    const handleDelete = () => {
        deleteProduct(confirm.id);
        addToast(`"${confirm.name}" deleted.`, 'error');
        setConfirm(null);
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Products"
                subtitle={`${products.length} products total`}
                breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Products' }]}
                actions={<Btn onClick={() => setModalMode('add')}>＋ Add Product</Btn>}
            />

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="🔍  Search products…"
                    style={{ padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '240px' }}
                />
                <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span style={{ color: '#9ca3af', fontSize: '13px', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                            {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No products found.</td></tr>
                        ) : paginated.map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                <td style={{ padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {p.image && <img src={p.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />}
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '500', color: '#111827', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                                            {p.badge && <StatusBadge status={p.badge} customLabel={p.badge} />}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 14px', color: '#9ca3af' }}>{p.sku || '–'}</td>
                                <td style={{ padding: '12px 14px', textTransform: 'capitalize', color: '#374151' }}>{p.category}</td>
                                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                    <span style={{ fontWeight: '700', color: '#16a34a' }}>${Number(p.price).toFixed(2)}</span>
                                    {p.originalPrice && <span style={{ color: '#9ca3af', fontSize: '11px', marginLeft: '4px', textDecoration: 'line-through' }}>${Number(p.originalPrice).toFixed(2)}</span>}
                                </td>
                                <td style={{ padding: '12px 14px', color: p.stock < 20 ? '#d97706' : '#374151', fontWeight: p.stock < 20 ? '700' : '400' }}>{p.stock}</td>
                                <td style={{ padding: '12px 14px' }}><StatusBadge status={p.inStock ? 'active' : 'inactive'} customLabel={p.inStock ? 'In Stock' : 'Out of Stock'} /></td>
                                <td style={{ padding: '12px 14px', textAlign: 'center' }}>{p.featured ? '⭐' : '–'}</td>
                                <td style={{ padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <Btn variant="ghost" style={{ padding: '5px 10px' }} onClick={() => { setEditing(p); setModalMode('edit'); }}>✏️</Btn>
                                        <Btn variant="danger" style={{ padding: '5px 10px' }} onClick={() => setConfirm(p)}>🗑️</Btn>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Pagination page={page} totalPages={totalPages} onPage={setPage} /></div>

            {/* Add/Edit Modal */}
            <Modal open={!!modalMode} onClose={() => { setModalMode(null); setEditing(null); }} title={modalMode === 'add' ? 'Add New Product' : 'Edit Product'} width="680px">
                <ProductForm initial={modalMode === 'edit' ? editing : emptyForm} onSave={modalMode === 'add' ? handleAdd : handleEdit} onClose={() => { setModalMode(null); setEditing(null); }} />
            </Modal>

            {/* Delete Confirm */}
            <ConfirmDialog open={!!confirm} title="Delete Product?" message={`"${confirm?.name}" will be permanently removed.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
        </AdminLayout>
    );
};

export default Products;
