import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AdminProvider } from '../../context/AdminContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const AdminLayoutInner = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const navigate = useNavigate();
    const location = useLocation();

    // Auth check
    useEffect(() => {
        try {
            const auth = JSON.parse(localStorage.getItem('puregold_admin_auth'));
            if (!auth?.loggedIn) {
                navigate('/admin/login', { replace: true });
            }
        } catch {
            navigate('/admin/login', { replace: true });
        }
    }, [navigate, location.pathname]);

    // Track window size
    useEffect(() => {
        const onResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main content */}
            <div
                className="transition-all duration-300 lg:pb-0 pb-20"
                style={{ marginLeft: isDesktop ? (collapsed ? 72 : 260) : 0 }}
            >
                <AdminTopbar onMenuToggle={() => setCollapsed(c => !c)} />
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// Wrap with AdminProvider
const AdminLayout = () => (
    <AdminProvider>
        <AdminLayoutInner />
    </AdminProvider>
);

export default AdminLayout;

