// Admin Toast notification system
import { useState, useCallback, useEffect } from 'react';
import { createContext, useContext } from 'react';

const ToastContext = createContext(null);

export const AdminToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts((t) => [...t, { id, message, type }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    }, []);

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {toasts.map((t) => (
                    <div key={t.id} style={{
                        padding: '13px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: '500',
                        background: t.type === 'success' ? '#f0fdf4' : t.type === 'error' ? '#fef2f2' : t.type === 'warning' ? '#fffbeb' : '#eff6ff',
                        color: t.type === 'success' ? '#166534' : t.type === 'error' ? '#991b1b' : t.type === 'warning' ? '#92400e' : '#1e40af',
                        border: `1px solid ${t.type === 'success' ? '#bbf7d0' : t.type === 'error' ? '#fecaca' : t.type === 'warning' ? '#fde68a' : '#bfdbfe'}`,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        maxWidth: '340px',
                        animation: 'toastIn 0.3s ease',
                    }}>
                        {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'} {t.message}
                    </div>
                ))}
            </div>
            <style>{`@keyframes toastIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }`}</style>
        </ToastContext.Provider>
    );
};

export const useAdminToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useAdminToast must be used within AdminToastProvider');
    return ctx;
};
