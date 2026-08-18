import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User, Package, Heart, MapPin, Settings, LogOut, ShoppingBag
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

// Mock order data
const mockOrders = [
    { id: 'CCE-10234', date: '2024-05-15', status: 'Delivered', total: 64.99, items: 2 },
    { id: 'CCE-09871', date: '2024-04-02', status: 'Delivered', total: 32.97, items: 3 },
    { id: 'CCE-08456', date: '2024-02-18', status: 'Delivered', total: 89.99, items: 1 },
];

const tabs = [
    { id: 'profile', label: 'Profile', Icon: User },
    { id: 'orders', label: 'Orders', Icon: Package },
    { id: 'wishlist', label: 'Wishlist', Icon: Heart },
    { id: 'addresses', label: 'Addresses', Icon: MapPin },
    { id: 'settings', label: 'Settings', Icon: Settings },
];

const Account = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { wishlist, removeFromWishlist } = useWishlist();
    const { products: wishlistProducts } = { products: wishlist };

    const statusColor = (status) => {
        if (status === 'Delivered') return 'text-green-600 bg-green-50';
        if (status === 'Processing') return 'text-amber-600 bg-amber-50';
        return 'text-blue-600 bg-blue-50';
    };

    return (
        <div className="min-h-screen bg-cream-50 pt-20">
            {/* Header */}
            <div className="bg-cinnamon-900 py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-5">
                    <div className="w-16 h-16 bg-cinnamon-600 rounded-2xl flex items-center justify-center text-2xl text-white font-bold">
                        A
                    </div>
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-white">Alex Johnson</h1>
                        <p className="text-cream-200/70 text-sm">alex@example.com · Member since May 2024</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex gap-8 flex-col lg:flex-row">
                    {/* Sidebar */}
                    <aside className="lg:w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                            {tabs.map(({ id, label, Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors text-left border-l-2 ${activeTab === id ? 'bg-cinnamon-50 text-cinnamon-800 border-cinnamon-600' : 'text-gray-600 hover:bg-cream-50 border-transparent'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                            <div className="border-t border-cream-200">
                                <Link
                                    to="/"
                                    className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-l-2 border-transparent"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                            {/* Profile */}
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-2xl shadow-card p-8">
                                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-6">My Profile</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {[
                                            { label: 'Full Name', value: 'Alex Johnson', type: 'text' },
                                            { label: 'Email', value: 'alex@example.com', type: 'email' },
                                            { label: 'Phone', value: '+1 555 123 4567', type: 'tel' },
                                            { label: 'Date of Birth', value: '1995-06-15', type: 'date' },
                                        ].map(({ label, value, type }) => (
                                            <div key={label}>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                                                <input type={type} defaultValue={value} className="w-full border border-cream-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-6 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md">
                                        Save Changes
                                    </button>
                                </div>
                            )}

                            {/* Orders */}
                            {activeTab === 'orders' && (
                                <div className="space-y-4">
                                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-6">Order History</h2>
                                    {mockOrders.map((order) => (
                                        <div key={order.id} className="bg-white rounded-2xl shadow-card p-6 flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <p className="font-bold text-cinnamon-900 text-sm">{order.id}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <div className="text-right">
                                                <p className="font-bold text-cinnamon-700">${order.total.toFixed(2)}</p>
                                                <button className="text-xs text-cinnamon-600 hover:text-cinnamon-800 mt-0.5 transition-colors">Reorder</button>
                                            </div>
                                        </div>
                                    ))}
                                    {mockOrders.length === 0 && (
                                        <div className="text-center py-20">
                                            <ShoppingBag className="w-16 h-16 text-cinnamon-200 mx-auto mb-4" />
                                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                                            <Link to="/shop" className="inline-block mt-4 text-sm text-cinnamon-700 underline">Start shopping</Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Wishlist */}
                            {activeTab === 'wishlist' && (
                                <div>
                                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-6">My Wishlist ({wishlist.length})</h2>
                                    {wishlist.length === 0 ? (
                                        <div className="text-center py-20 bg-white rounded-2xl shadow-card">
                                            <Heart className="w-16 h-16 text-cinnamon-200 mx-auto mb-4" />
                                            <p className="text-gray-500">Your wishlist is empty.</p>
                                            <Link to="/shop" className="inline-block mt-4 text-sm text-cinnamon-700 underline">Browse products</Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {wishlist.map((p) => <ProductCard key={p.id} product={p} />)}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Addresses */}
                            {activeTab === 'addresses' && (
                                <div className="bg-white rounded-2xl shadow-card p-8">
                                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-6">Saved Addresses</h2>
                                    <div className="border-2 border-dashed border-cream-300 rounded-2xl p-6 text-center">
                                        <MapPin className="w-10 h-10 text-cinnamon-300 mx-auto mb-3" />
                                        <p className="text-gray-500 text-sm mb-3">No saved addresses yet.</p>
                                        <button className="text-sm text-cinnamon-700 border border-cinnamon-300 px-4 py-2 rounded-xl hover:bg-cinnamon-50 transition-colors">
                                            + Add Address
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Settings */}
                            {activeTab === 'settings' && (
                                <div className="bg-white rounded-2xl shadow-card p-8">
                                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-6">Account Settings</h2>
                                    <div className="space-y-4">
                                        {[
                                            'Email notifications for orders',
                                            'Promotional emails & offers',
                                            'Newsletter subscription',
                                            'SMS notifications',
                                        ].map((setting) => (
                                            <div key={setting} className="flex items-center justify-between py-3 border-b border-cream-100">
                                                <span className="text-sm text-gray-700">{setting}</span>
                                                <input type="checkbox" defaultChecked className="accent-cinnamon-600 w-4 h-4 cursor-pointer" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-cream-200">
                                        <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
                                        <button className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Account;
