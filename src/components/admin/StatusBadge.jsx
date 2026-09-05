const statusConfig = {
    // Order statuses
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Pending' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', label: 'Processing' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500', label: 'Shipped' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Delivered' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Cancelled' },
    // Review statuses
    approved: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Approved' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Rejected' },
    // Customer statuses
    active: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Active' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Inactive' },
    // Product
    'in-stock': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'In Stock' },
    'low-stock': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Low Stock' },
    'out-of-stock': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Out of Stock' },
};

const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: status };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

export default StatusBadge;
