import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Star,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/reviews', icon: Star, label: 'Reviews' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
    return (
        <>
            {/* Desktop sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-cinnamon-900 z-40 overflow-hidden"
            >
                {/* Brand */}
                <div className="flex items-center justify-between px-4 h-16 border-b border-cinnamon-800/50">
                    <AnimatePresence mode="wait">
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-8 h-8 bg-gold-400 rounded-lg flex items-center justify-center">
                                    <span className="text-cinnamon-900 font-bold text-sm">PG</span>
                                </div>
                                <div className="leading-tight">
                                    <span className="text-cream-100 font-bold text-sm tracking-wide block">PURE GOLD</span>
                                    <span className="text-cinnamon-400 text-[10px] tracking-wider uppercase">Admin Panel</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {collapsed && (
                        <div className="w-8 h-8 bg-gold-400 rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-cinnamon-900 font-bold text-sm">PG</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                                ${isActive
                                    ? 'bg-cinnamon-700/50 text-cream-100'
                                    : 'text-cinnamon-300 hover:bg-cinnamon-800/60 hover:text-cream-100'
                                }
                                ${collapsed ? 'justify-center' : ''}`
                            }
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span>{label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse toggle */}
                <div className="border-t border-cinnamon-800/50 p-2">
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-cinnamon-400 hover:text-cream-100 hover:bg-cinnamon-800/60 transition-colors text-sm"
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : (
                            <>
                                <ChevronLeft className="w-5 h-5" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Logout */}
                <div className="border-t border-cinnamon-800/50 p-2">
                    <button
                        onClick={() => {
                            localStorage.removeItem('puregold_admin_auth');
                            window.location.href = '/admin/login';
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile bottom bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-cinnamon-900 z-40 border-t border-cinnamon-800/50">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.slice(0, 5).map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] transition-colors
                                ${isActive ? 'text-gold-400' : 'text-cinnamon-400 hover:text-cream-100'}`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
};

export default AdminSidebar;
