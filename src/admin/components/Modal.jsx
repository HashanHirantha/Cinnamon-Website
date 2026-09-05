// Reusable Modal component
import { useEffect } from 'react';

const Modal = ({ open, onClose, title, children, width = '560px', footer }) => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={onClose}>
            <div
                style={{
                    background: '#fff', borderRadius: '16px', width: '100%', maxWidth: width,
                    maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    animation: 'modalIn 0.2s ease',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>{title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
                {/* Body */}
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>{children}</div>
                {/* Footer */}
                {footer && (
                    <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexShrink: 0 }}>
                        {footer}
                    </div>
                )}
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform: scale(0.96) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
        </div>
    );
};

export default Modal;
