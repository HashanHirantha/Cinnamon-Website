import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './components/Toast';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Routing with transitions
const AppRoutes = () => {
    const location = useLocation();
    // Login/register pages don't show Navbar+Footer
    const isAuth = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!isAuth && <Navbar />}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
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
                    <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
                </Routes>
            </AnimatePresence>
            {!isAuth && <Footer />}
            {!isAuth && <BackToTop />}
        </>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <ToastProvider>
                            <AppRoutes />
                        </ToastProvider>
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
