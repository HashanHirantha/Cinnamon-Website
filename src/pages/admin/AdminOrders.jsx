import { useState } from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import StatusBadge from '../../components/admin/StatusBadge';

const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
    const { orders, updateOrderStatus } = useAdmin();
    const [filter, setFilter] = useState('all');
    const [viewOrder, setViewOrder] = useState(null);

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    const columns = [
        {
            key: 'id', header: 'Order ID', accessor: 'id',
            render: (row) => <span className="font-semibold text-gray-900">{row.id}</span>,
        },
        {
            key: 'customer', header: 'Customer', accessor: (r) => r.customer.name,
            render: (row) => (
                <div>
                    <p className="text-sm font-medium text-gray-900">{row.customer.name}</p>
                    <p className="text-xs text-gray-400">{row.customer.email}</p>
                </div>
            ),
        },
        {
            key: 'date', header: 'Date', accessor: 'date',
            render: (row) => <span className="text-sm text-gray-600">{new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>,
        },
        {
            key: 'items', header: 'Items',
            render: (row) => <span className="text-sm text-gray-600">{row.items.length} item{row.items.length > 1 ? 's' : ''}</span>,
        },
        {
            key: 'total', header: 'Total', accessor: 'total',
            render: (row) => <span className="font-semibold text-gray-900">${row.total.toFixed(2)}</span>,
        },
        {
            key: 'status', header: 'Status',
            render: (row) => (
                <div className="relative inline-block">
                    <select
                        value={row.status}
                        onChange={(e) => updateOrderStatus(row.id, e.target.value)}
                        className="appearance-none bg-transparent text-sm font-medium pr-6 cursor-pointer focus:outline-none"
                    >
                        {statusOptions.filter(s => s !== 'all').map(s => (
                            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            ),
        },
        {
            key: 'actions', header: '', sortable: false,
            render: (row) => (
                <button onClick={() => setViewOrder(row)} className="p-2 hover:bg-cinnamon-50 rounded-lg transition-colors" title="View Details">
                    <Eye className="w-4 h-4 text-cinnamon-600" />
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2 flex-wrap">
                {statusOptions.map(status => {
                    const count = status === 'all' ? orders.length : orders.filter(o => o.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
                                ${filter === status ? 'bg-cinnamon-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-cream-100 border border-gray-200'}`}
                        >
                            {status === 'all' ? 'All' : status} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filtered}
                searchPlaceholder="Search orders..."
                emptyMessage="No orders found"
            />

            {/* Order detail modal */}
            <AdminModal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder?.id}`} size="md">
                {viewOrder && (
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="flex items-center justify-between">
                            <StatusBadge status={viewOrder.status} />
                            <span className="text-sm text-gray-500">{new Date(viewOrder.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        {/* Customer */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer</h3>
                            <p className="text-sm text-gray-900 font-medium">{viewOrder.customer.name}</p>
                            <p className="text-xs text-gray-500">{viewOrder.customer.email}</p>
                        </div>

                        {/* Items */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
                            <div className="space-y-3">
                                {viewOrder.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">${viewOrder.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                <span>Total</span>
                                <span>${viewOrder.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                <p className="font-medium text-gray-900">{viewOrder.paymentMethod}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                                <p className="font-medium text-gray-900 text-xs">{viewOrder.shippingAddress}</p>
                            </div>
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default AdminOrders;
