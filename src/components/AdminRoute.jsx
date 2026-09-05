import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

// Access Denied screen shown when a non-ADMIN role tries to access /admin
const AccessDenied = () => (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0a06',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
    }}>
        <div style={{
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '440px',
        }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚫</div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444', marginBottom: '12px' }}>
                Access Denied
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '32px', lineHeight: 1.6 }}>
                Your account does not have the <strong style={{ color: '#f59e0b' }}>ADMIN</strong> role
                required to access this area.
            </p>
            <a
                href="/"
                style={{
                    display: 'inline-block',
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #92400e, #78350f)',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                }}
            >
                ← Return to Store
            </a>
        </div>
    </div>
);

const AdminRoute = ({ children }) => {
    const { adminUser, isAdmin } = useAdminAuth();
    const location = useLocation();

    if (!adminUser) {
        return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
    }

    if (!isAdmin) {
        return <AccessDenied />;
    }

    return children;
};

export default AdminRoute;
