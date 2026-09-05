import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import StatsCard from '../../components/admin/StatsCard';
import StatusBadge from '../../components/admin/StatusBadge';

const Dashboard = () => {
    const { stats, products } = useAdmin();

    // Simple revenue bar chart data (last 7 "days" using order data)
    const revenueByDay = (() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = days.map(() => Math.floor(Math.random() * 400) + 100);
        const max = Math.max(...values);
        return days.map((day, i) => ({ day, value: values[i], height: (values[i] / max) * 100 }));
    })();

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatsCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    trend={12.5}
                    trendLabel="vs last month"
                    color="green"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    trend={8.2}
                    trendLabel="vs last month"
                    color="blue"
                />
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="cinnamon"
                />
                <StatsCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    trend={15.3}
                    trendLabel="vs last month"
                    color="purple"
                />
            </div>

            {/* Charts + Order Status row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Revenue chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
                            <p className="text-sm text-gray-400">Weekly revenue breakdown</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-48">
                        {revenueByDay.map(({ day, value, height }) => (
                            <div key={day} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs font-semibold text-gray-600">${value}</span>
                                <div className="w-full relative">
                                    <div
                                        className="w-full bg-gradient-to-t from-cinnamon-600 to-cinnamon-400 rounded-t-lg transition-all duration-500 hover:from-cinnamon-700 hover:to-cinnamon-500"
                                        style={{ height: `${height * 1.5}px`, minHeight: '12px' }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order status breakdown */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Order Status</h2>
                    <p className="text-sm text-gray-400 mb-5">Current order breakdown</p>
                    <div className="space-y-4">
                        {Object.entries(stats.ordersByStatus).map(([status, count]) => {
                            const total = stats.totalOrders || 1;
                            const pct = Math.round((count / total) * 100);
                            const colors = {
                                pending: 'bg-amber-500',
                                processing: 'bg-blue-500',
                                shipped: 'bg-purple-500',
                                delivered: 'bg-green-500',
                                cancelled: 'bg-red-500',
                            };
                            return (
                                <div key={status}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${colors[status] || 'bg-gray-400'} transition-all duration-500`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Orders + Top Products + Low Stock */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* Recent orders */}
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-sm text-cinnamon-600 hover:text-cinnamon-700 font-medium flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-cream-50/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-3 text-gray-600">{order.customer.name}</td>
                                        <td className="px-6 py-3 font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                                        <td className="px-6 py-3"><StatusBadge status={order.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products + Low Stock alerts */}
                <div className="space-y-5">
                    {/* Top products */}
                    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
                            <Link to="/admin/products" className="text-sm text-cinnamon-600 hover:text-cinnamon-700 font-medium flex items-center gap-1">
                                View all <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {stats.topProducts.map((product, i) => (
                                <div key={product.id} className="flex items-center gap-4 px-6 py-3 hover:bg-cream-50/50 transition-colors">
                                    <span className="w-6 h-6 bg-cinnamon-100 text-cinnamon-700 rounded-full flex items-center justify-center text-xs font-bold">
                                        {i + 1}
                                    </span>
                                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                        <p className="text-xs text-gray-400">{product.reviewCount} reviews</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">${product.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low stock */}
                    {stats.lowStockProducts.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                <h3 className="font-bold text-amber-800">Low Stock Alerts</h3>
                            </div>
                            <div className="space-y-2">
                                {stats.lowStockProducts.map(p => (
                                    <div key={p.id} className="flex items-center justify-between bg-white/70 rounded-xl px-4 py-2.5">
                                        <span className="text-sm text-gray-700 font-medium">{p.name}</span>
                                        <span className="text-sm font-bold text-amber-700">{p.stock} left</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
