import { useState } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import StatusBadge from '../../components/admin/StatusBadge';

const emptyProduct = {
    name: '', slug: '', shortDescription: '', description: '', category: 'quills',
    image: '', price: '', originalPrice: '', weight: '', origin: '', ingredients: '',
    processing: '', shipping: 'Ships within 1-2 business days. International delivery in 7-14 days.',
    rating: 0, reviewCount: 0, stock: 0, inStock: true, badge: '', featured: false,
    tags: [],
};

const categories = ['quills', 'powder', 'tea', 'oils', 'gifts'];

const AdminProducts = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyProduct);
    const [filterCat, setFilterCat] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyProduct);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setForm({ ...product, price: String(product.price), originalPrice: product.originalPrice ? String(product.originalPrice) : '', stock: String(product.stock), tags: product.tags || [] });
        setModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            ...form,
            price: parseFloat(form.price) || 0,
            originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
            stock: parseInt(form.stock) || 0,
            inStock: parseInt(form.stock) > 0,
            slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            images: form.image ? [form.image] : [],
            tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
        };
        if (editing) {
            updateProduct({ ...data, id: editing.id });
        } else {
            addProduct(data);
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        deleteProduct(id);
        setDeleteConfirm(null);
    };

    const filtered = filterCat === 'all' ? products : products.filter(p => p.category === filterCat);

    const columns = [
        {
            key: 'image', header: 'Product', sortable: false,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.image} alt={row.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{row.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{row.category}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'price', header: 'Price', accessor: 'price',
            render: (row) => (
                <div>
                    <span className="font-semibold text-gray-900">${row.price.toFixed(2)}</span>
                    {row.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-2">${row.originalPrice.toFixed(2)}</span>
                    )}
                </div>
            ),
        },
        {
            key: 'stock', header: 'Stock', accessor: 'stock',
            render: (row) => {
                const status = row.stock === 0 ? 'out-of-stock' : row.stock <= 30 ? 'low-stock' : 'in-stock';
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{row.stock}</span>
                        <StatusBadge status={status} />
                    </div>
                );
            },
        },
        {
            key: 'rating', header: 'Rating', accessor: 'rating',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{row.rating}</span>
                    <span className="text-xs text-gray-400">({row.reviewCount})</span>
                </div>
            ),
        },
        {
            key: 'featured', header: 'Featured',
            render: (row) => row.featured ? (
                <span className="text-xs font-semibold text-gold-600 bg-gold-300/30 px-2 py-0.5 rounded-full">Featured</span>
            ) : <span className="text-xs text-gray-400">—</span>,
        },
        {
            key: 'actions', header: 'Actions', sortable: false,
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(row)} className="p-2 hover:bg-cinnamon-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4 text-cinnamon-600" />
                    </button>
                    <button onClick={() => setDeleteConfirm(row.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            ),
        },
    ];

    const updateField = (key, value) => setForm(f => ({ ...f, [key]: value }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} products in your store</p>
                </div>
                <button onClick={openAdd} className="inline-flex items-center gap-2 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-premium text-sm">
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap">
                {['all', ...categories].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCat(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
                            ${filterCat === cat ? 'bg-cinnamon-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-cream-100 border border-gray-200'}`}
                    >
                        {cat === 'all' ? 'All Products' : cat}
                    </button>
                ))}
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filtered}
                searchPlaceholder="Search products..."
                emptyMessage="No products found"
            />

            {/* Add/Edit Modal */}
            <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                            <input type="text" required value={form.name} onChange={e => updateField('name', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input type="text" value={form.slug} onChange={e => updateField('slug', e.target.value)} placeholder="auto-generated"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select value={form.category} onChange={e => updateField('category', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm capitalize">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input type="url" value={form.image} onChange={e => updateField('image', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                            <input type="number" step="0.01" required value={form.price} onChange={e => updateField('price', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                            <input type="number" step="0.01" value={form.originalPrice} onChange={e => updateField('originalPrice', e.target.value)} placeholder="For discounts"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                            <input type="number" required value={form.stock} onChange={e => updateField('stock', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input type="text" value={form.weight} onChange={e => updateField('weight', e.target.value)} placeholder="e.g. 100g"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                            <input type="text" value={form.origin} onChange={e => updateField('origin', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                            <input type="text" value={form.badge} onChange={e => updateField('badge', e.target.value)} placeholder="Best Seller, Premium, etc."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                        <input type="text" value={form.shortDescription} onChange={e => updateField('shortDescription', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows="3" value={form.description} onChange={e => updateField('description', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                        <input type="text" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={e => updateField('tags', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="featured" checked={form.featured} onChange={e => updateField('featured', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-cinnamon-600 focus:ring-cinnamon-500" />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured product</label>
                    </div>
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-cinnamon-600 hover:bg-cinnamon-700 text-white transition-all shadow-premium">
                            {editing ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* Delete confirm modal */}
            <AdminModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Product" size="sm">
                <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all">Delete</button>
                </div>
            </AdminModal>
        </div>
    );
};

export default AdminProducts;
