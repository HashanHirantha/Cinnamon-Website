import { Bell, Search, Menu } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const AdminTopbar = ({ onMenuToggle }) => {
    const { stats } = useAdmin();

    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6">
            {/* Left side */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Menu className="w-5 h-5 text-gray-600" />
                </button>

                {/* Search */}
                <div className="hidden sm:block relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none transition-all bg-gray-50 w-64"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {stats.pendingOrders > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {stats.pendingOrders}
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 hidden sm:block" />

                {/* Admin avatar */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-cinnamon-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="text-sm font-semibold text-gray-900">Admin</p>
                        <p className="text-[11px] text-gray-400">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
