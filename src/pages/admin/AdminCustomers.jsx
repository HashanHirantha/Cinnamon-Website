import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import StatusBadge from '../../components/admin/StatusBadge';

const AdminCustomers = () => {
    const { customers, orders } = useAdmin();
    const [viewCustomer, setViewCustomer] = useState(null);

    // Get customer orders
    const getCustomerOrders = (email) => orders.filter(o => o.customer.email === email);

    const columns = [
        {
            key: 'name', header: 'Customer', accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-cinnamon-100 rounded-full flex items-center justify-center">
                        <span className="text-cinnamon-700 font-bold text-sm">{row.name.charAt(0)}</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-400">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'country', header: 'Country', accessor: 'country',
            render: (row) => <span className="text-sm text-gray-600">{row.country}</span>,
        },
        {
            key: 'ordersCount', header: 'Orders', accessor: 'ordersCount',
            render: (row) => <span className="text-sm font-semibold text-gray-900">{row.ordersCount}</span>,
        },
        {
            key: 'totalSpent', header: 'Total Spent', accessor: 'totalSpent',
            render: (row) => <span className="text-sm font-semibold text-gray-900">${row.totalSpent.toFixed(2)}</span>,
        },
        {
            key: 'joined', header: 'Joined', accessor: 'joined',
            render: (row) => <span className="text-sm text-gray-600">{new Date(row.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>,
        },
        {
            key: 'status', header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: 'actions', header: '', sortable: false,
            render: (row) => (
                <button onClick={() => setViewCustomer(row)} className="text-sm text-cinnamon-600 hover:text-cinnamon-700 font-medium">
                    View
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500 mt-1">{customers.length} registered customers</p>
            </div>

            <DataTable
                columns={columns}
                data={customers}
                searchPlaceholder="Search customers..."
                emptyMessage="No customers found"
            />

            {/* Customer detail modal */}
            <AdminModal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Customer Details" size="md">
                {viewCustomer && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-cinnamon-100 rounded-2xl flex items-center justify-center">
                                <span className="text-cinnamon-700 font-bold text-2xl">{viewCustomer.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{viewCustomer.name}</h3>
                                <p className="text-sm text-gray-500">{viewCustomer.email}</p>
                                <p className="text-sm text-gray-400">{viewCustomer.country}</p>
                            </div>
                            <div className="ml-auto">
                                <StatusBadge status={viewCustomer.status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">{viewCustomer.ordersCount}</p>
                                <p className="text-xs text-gray-500">Orders</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">${viewCustomer.totalSpent.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">Total Spent</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">{new Date(viewCustomer.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                                <p className="text-xs text-gray-500">Member Since</p>
                            </div>
                        </div>

                        {/* Customer orders */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Orders</h4>
                            {getCustomerOrders(viewCustomer.email).length === 0 ? (
                                <p className="text-sm text-gray-400">No orders yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {getCustomerOrders(viewCustomer.email).slice(0, 5).map(order => (
                                        <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">{order.id}</span>
                                                <p className="text-xs text-gray-400">{order.date}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                                                <StatusBadge status={order.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default AdminCustomers;
