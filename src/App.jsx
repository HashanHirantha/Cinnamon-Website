import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './components/Toast';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import CeylonCinnamon from './pages/CeylonCinnamon';
import NotFound from './pages/NotFound';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';

// Page transition wrapper
const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

// Routing with transitions
const AppRoutes = () => {
    const location = useLocation();
    // Login/register/admin pages don't show Navbar+Footer
    const isAuth = location.pathname === '/login' || location.pathname === '/register';
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <>
            {!isAuth && !isAdmin && <Navbar />}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                    <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
                    <Route path="/shop/:slug" element={<PageWrapper><ProductDetails /></PageWrapper>} />
                    <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
                    <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
                    <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                    <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                    <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                    <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                    <Route path="/account" element={<PageWrapper><Account /></PageWrapper>} />
                    <Route path="/ceylon-cinnamon" element={<PageWrapper><CeylonCinnamon /></PageWrapper>} />

                    {/* Admin routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
                </Routes>
            </AnimatePresence>
            {!isAuth && !isAdmin && <Footer />}
            {!isAuth && !isAdmin && <BackToTop />}
        </>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <CartProvider>
                <WishlistProvider>
                    <ToastProvider>
                        <AppRoutes />
                    </ToastProvider>
                </WishlistProvider>
            </CartProvider>
        </BrowserRouter>
    );
};

export default App;

