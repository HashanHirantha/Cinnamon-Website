import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './components/Toast';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminToastProvider } from './admin/components/AdminToast';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Public pages
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

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Payments from './pages/admin/Payments';
import Delivery from './pages/admin/Delivery';
import Coupons from './pages/admin/Coupons';
import Reviews from './pages/admin/Reviews';
import Reports from './pages/admin/Reports';
import Notifications from './pages/admin/Notifications';
import Staff from './pages/admin/Staff';
import Settings from './pages/admin/Settings';

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

// Protected route — redirects unauthenticated users to /login
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return children;
};

// Routing
const AppRoutes = () => {
    const location = useLocation();
    const isAuth = location.pathname === '/login' || location.pathname === '/register';
    const isAdmin = location.pathname.startsWith('/admin');
    const hideChrome = isAuth || isAdmin;

    return (
        <>
            {!hideChrome && <Navbar />}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* Public routes */}
                    <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                    <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
                    <Route path="/shop/:slug" element={<PageWrapper><ProductDetails /></PageWrapper>} />
                    <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
                    <Route path="/checkout" element={<ProtectedRoute><PageWrapper><Checkout /></PageWrapper></ProtectedRoute>} />
                    <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                    <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                    <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                    <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                    <Route path="/account" element={<PageWrapper><Account /></PageWrapper>} />
                    <Route path="/ceylon-cinnamon" element={<PageWrapper><CeylonCinnamon /></PageWrapper>} />

                    {/* Admin routes — completely separated, no Navbar/Footer */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><Categories /></AdminRoute>} />
                    <Route path="/admin/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
                    <Route path="/admin/customers" element={<AdminRoute><Customers /></AdminRoute>} />
                    <Route path="/admin/payments" element={<AdminRoute><Payments /></AdminRoute>} />
                    <Route path="/admin/delivery" element={<AdminRoute><Delivery /></AdminRoute>} />
                    <Route path="/admin/coupons" element={<AdminRoute><Coupons /></AdminRoute>} />
                    <Route path="/admin/reviews" element={<AdminRoute><Reviews /></AdminRoute>} />
                    <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
                    <Route path="/admin/notifications" element={<AdminRoute><Notifications /></AdminRoute>} />
                    <Route path="/admin/staff" element={<AdminRoute><Staff /></AdminRoute>} />
                    <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />

                    <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
                </Routes>
            </AnimatePresence>
            {!hideChrome && <Footer />}
            {!hideChrome && <BackToTop />}
        </>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AdminAuthProvider>
                <AdminToastProvider>
                    <AuthProvider>
                        <CartProvider>
                            <WishlistProvider>
                                <ToastProvider>
                                    <AppRoutes />
                                </ToastProvider>
                            </WishlistProvider>
                        </CartProvider>
                    </AuthProvider>
                </AdminToastProvider>
            </AdminAuthProvider>
        </BrowserRouter>
    );
};

export default App;

