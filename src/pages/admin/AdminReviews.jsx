import { useState } from 'react';
import { Check, X, Trash2, Star } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import StatusBadge from '../../components/admin/StatusBadge';

const AdminReviews = () => {
    const { reviews, updateReviewStatus, deleteReview } = useAdmin();
    const [filter, setFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

    const columns = [
        {
            key: 'customer', header: 'Customer', accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-400">{row.country}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'title', header: 'Review', accessor: 'title',
            render: (row) => (
                <div className="max-w-xs">
                    <p className="text-sm font-medium text-gray-900 truncate">{row.title}</p>
                    <p className="text-xs text-gray-400 truncate">{row.text}</p>
                </div>
            ),
        },
        {
            key: 'rating', header: 'Rating', accessor: 'rating',
            render: (row) => (
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= row.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    ))}
                </div>
            ),
        },
        {
            key: 'date', header: 'Date', accessor: 'date',
            render: (row) => <span className="text-sm text-gray-600">{new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>,
        },
        {
            key: 'status', header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: 'actions', header: 'Actions', sortable: false,
            render: (row) => (
                <div className="flex items-center gap-1">
                    {row.status !== 'approved' && (
                        <button onClick={() => updateReviewStatus(row.id, 'approved')} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                            <Check className="w-4 h-4 text-green-600" />
                        </button>
                    )}
                    {row.status !== 'rejected' && (
                        <button onClick={() => updateReviewStatus(row.id, 'rejected')} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                            <X className="w-4 h-4 text-red-500" />
                        </button>
                    )}
                    <button onClick={() => setDeleteConfirm(row.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            ),
        },
    ];

    const statusCounts = {
        all: reviews.length,
        approved: reviews.filter(r => r.status === 'approved').length,
        pending: reviews.filter(r => r.status === 'pending').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                <p className="text-sm text-gray-500 mt-1">Manage customer reviews and ratings</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
                            ${filter === status ? 'bg-cinnamon-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-cream-100 border border-gray-200'}`}
                    >
                        {status} ({count})
                    </button>
                ))}
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                searchPlaceholder="Search reviews..."
                emptyMessage="No reviews found"
            />

            {/* Delete confirm */}
            <AdminModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Review" size="sm">
                <p className="text-gray-600 mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={() => { deleteReview(deleteConfirm); setDeleteConfirm(null); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all">Delete</button>
                </div>
            </AdminModal>
        </div>
    );
};

export default AdminReviews;
