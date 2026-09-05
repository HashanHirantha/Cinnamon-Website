import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, User, Menu, X, Heart, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import CustomLogo from '../assets/logo.svg';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'Our Story' },
    { to: '/ceylon-cinnamon', label: 'Ceylon Cinnamon' },
    { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Only the home page gets the transparent-until-scroll treatment
    const isHome = location.pathname === '/';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        // Reset on route change
        setScrolled(window.scrollY > 40);
        return () => window.removeEventListener('scroll', onScroll);
    }, [location.pathname]);

    // Close mobile on resize
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Lock body scroll when mobile open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    // ── Navbar appearance logic ──
    // Home page: transparent → white on scroll
    // Inner pages: always solid cinnamon-brown
    const navbarBg = isHome
        ? (scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent')
        : 'bg-cinnamon-900/95 backdrop-blur-md shadow-lg';

    const logoColor = (isHome && !scrolled) ? 'text-white' : (isHome ? 'text-cinnamon-900' : 'text-cream-100');
    const linkColor = (isHome && !scrolled)
        ? 'text-white/90 hover:text-white'
        : (isHome ? 'text-gray-700 hover:text-cinnamon-700' : 'text-cream-200 hover:text-amber-300');
    const iconColor = (isHome && !scrolled)
        ? 'text-white hover:text-cream-300'
        : (isHome ? 'text-gray-700 hover:text-cinnamon-700' : 'text-cream-200 hover:text-amber-300');

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navbarBg}`}
            >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link
                            to="/"
                            className={`flex items-center gap-3 font-serif text-2xl font-bold tracking-widest transition-colors duration-300 ${logoColor}`}
                        >
                            <img src={CustomLogo} alt="Pure Gold Logo" className="h-12 w-auto object-contain drop-shadow-md" />
                            <div>
                                CEYLONÉ
                                <span className={`block text-[10px] font-sans font-normal tracking-[0.2em] uppercase mt-[-4px] transition-colors ${scrolled ? 'text-cinnamon-500' : 'text-white/70'}`}>
                                    Pure Ceylon Cinnamon
                                </span>
                            </div>
                        </Link>

                        {/* Desktop nav links */}
                        <ul className="hidden lg:flex items-center gap-8">
                            {navLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        end={to === '/'}
                                        className={({ isActive }) =>
                                            `text-sm font-medium transition-colors duration-200 relative pb-1 group outline-none focus:outline-none ${linkColor} ${isActive ? 'text-cinnamon-600' : ''}`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {label}
                                                <span className={`absolute bottom-0 left-0 h-0.5 bg-cinnamon-500 rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop actions */}
                        <div className="hidden lg:flex items-center gap-2">
                            {/* Search */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                aria-label="Search"
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10 ${iconColor}`}
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Wishlist */}
                            <Link
                                to="/account"
                                aria-label="Wishlist"
                                className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10 ${iconColor}`}
                            >
                                <Heart className="w-5 h-5" />
                                {wishlist.length > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-cinnamon-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            {/* Account / User */}
                            {user ? (
                                <div className="flex items-center gap-1">
                                    <Link
                                        to="/account"
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-white/10 ${iconColor}`}
                                    >
                                        <User className="w-4 h-4" />
                                        {user.firstName || user.name?.split(' ')[0]}
                                    </Link>
                                    <button
                                        onClick={() => { signOut(); navigate('/'); }}
                                        aria-label="Sign out"
                                        title="Sign out"
                                        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all hover:bg-white/10 ${iconColor}`}
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    aria-label="Sign in"
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10 ${iconColor}`}
                                >
                                    <User className="w-5 h-5" />
                                </Link>
                            )}

                            {/* Cart */}
                            <Link
                                to="/cart"
                                aria-label="Cart"
                                className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10 ${iconColor}`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <motion.span
                                        key={cartCount}
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-cinnamon-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                    >
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </motion.span>
                                )}
                            </Link>

                        </div>

                        {/* Mobile: cart + hamburger */}
                        <div className="flex lg:hidden items-center gap-1">
                            <Link
                                to="/cart"
                                aria-label="Cart"
                                className={`relative w-10 h-10 flex items-center justify-center rounded-full ${iconColor}`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-cinnamon-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={() => setMobileOpen(true)}
                                aria-label="Open menu"
                                className={`w-10 h-10 flex items-center justify-center rounded-full ${iconColor}`}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-80 max-w-full z-[61] bg-white shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
                                <span className="font-serif text-xl font-bold text-cinnamon-900 tracking-widest">CEYLONÉ</span>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    aria-label="Close menu"
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="px-6 py-4 border-b border-cream-200">
                                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-cream-100 rounded-xl px-3 py-2">
                                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                                    />
                                </form>
                            </div>

                            {/* Nav links */}
                            <nav className="flex-1 px-6 py-6">
                                <ul className="space-y-1">
                                    {navLinks.map(({ to, label }) => (
                                        <li key={to}>
                                            <NavLink
                                                to={to}
                                                end={to === '/'}
                                                onClick={() => setMobileOpen(false)}
                                                className={({ isActive }) =>
                                                    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                                        ? 'bg-cinnamon-50 text-cinnamon-700 font-semibold'
                                                        : 'text-gray-700 hover:bg-cream-100'
                                                    }`
                                                }
                                            >
                                                {label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Bottom actions */}
                            <div className="px-6 py-6 border-t border-cream-200 flex flex-col gap-3">
                                <Link
                                    to={user ? '/account' : '/login'}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-cream-100 transition-colors"
                                >
                                    <User className="w-5 h-5 text-cinnamon-600" />
                                    {user ? user.name : 'Sign In'}
                                </Link>
                                {user && (
                                    <button
                                        onClick={() => { signOut(); navigate('/'); setMobileOpen(false); }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                )}
                                <Link
                                    to="/account"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-cream-100 transition-colors"
                                >
                                    <Heart className="w-5 h-5 text-cinnamon-600" />
                                    Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => { if (e.currentTarget === e.target) setSearchOpen(false); }}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            className="w-full max-w-2xl"
                        >
                            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl flex items-center px-5 py-4 gap-3">
                                <Search className="w-5 h-5 text-cinnamon-500 flex-shrink-0" />
                                <input
                                    autoFocus
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for cinnamon products..."
                                    className="flex-1 text-lg text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </form>
                            <p className="text-white/60 text-sm text-center mt-3">Press Enter to search, Esc to close</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
