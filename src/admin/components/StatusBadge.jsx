// Status Badge — colored pill for order/payment/stock/stock statuses
const STATUS_CONFIG = {
    // Order statuses
    pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
    confirmed: { bg: '#dbeafe', color: '#1e40af', label: 'Confirmed' },
    processing: { bg: '#ede9fe', color: '#5b21b6', label: 'Processing' },
    shipped: { bg: '#e0f2fe', color: '#0369a1', label: 'Shipped' },
    delivered: { bg: '#dcfce7', color: '#166534', label: 'Delivered' },
    cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
    refunded: { bg: '#f3f4f6', color: '#374151', label: 'Refunded' },
    // Payment
    paid: { bg: '#dcfce7', color: '#166534', label: 'Paid' },
    failed: { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
    // Stock
    'in stock': { bg: '#dcfce7', color: '#166534', label: 'In Stock' },
    'low stock': { bg: '#fef3c7', color: '#92400e', label: 'Low Stock' },
    'out of stock': { bg: '#fee2e2', color: '#991b1b', label: 'Out of Stock' },
    // General
    active: { bg: '#dcfce7', color: '#166534', label: 'Active' },
    inactive: { bg: '#f3f4f6', color: '#6b7280', label: 'Inactive' },
    blocked: { bg: '#fee2e2', color: '#991b1b', label: 'Blocked' },
    expired: { bg: '#fee2e2', color: '#991b1b', label: 'Expired' },
    approved: { bg: '#dcfce7', color: '#166534', label: 'Approved' },
    rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
    // Roles
    superadmin: { bg: '#fce7f3', color: '#9d174d', label: 'Super Admin' },
    product_manager: { bg: '#e0f2fe', color: '#0369a1', label: 'Product Manager' },
    order_manager: { bg: '#ede9fe', color: '#5b21b6', label: 'Order Manager' },
    customer_support: { bg: '#fff7ed', color: '#9a3412', label: 'Customer Support' },
};

const StatusBadge = ({ status, customLabel, size = 'sm' }) => {
    const key = typeof status === 'string' ? status.toLowerCase().replace(/_/g, ' ') : '';
    const cfg = STATUS_CONFIG[key] || { bg: '#f3f4f6', color: '#374151', label: status };
    const label = customLabel || cfg.label;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: size === 'sm' ? '3px 10px' : '5px 14px',
            borderRadius: '20px',
            fontSize: size === 'sm' ? '11px' : '13px',
            fontWeight: '600',
            background: cfg.bg,
            color: cfg.color,
            whiteSpace: 'nowrap',
        }}>
            {label}
        </span>
    );
};

export default StatusBadge;
