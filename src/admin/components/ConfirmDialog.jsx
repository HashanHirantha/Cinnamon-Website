// Confirm Dialog — delete/destructive action
const ConfirmDialog = ({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, danger = true }) => {
    if (!open) return null;
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
            <div style={{
                background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '420px', width: '100%',
                textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                animation: 'modalIn 0.2s ease',
            }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: danger ? '#fee2e2' : '#fef3c7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', fontSize: '24px',
                }}>
                    {danger ? '🗑️' : '⚠️'}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#111827' }}>{title}</h3>
                <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>{message}</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button onClick={onCancel} style={{ padding: '10px 24px', border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Cancel</button>
                    <button onClick={onConfirm} style={{ padding: '10px 24px', background: danger ? '#dc2626' : '#d97706', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{confirmLabel}</button>
                </div>
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform: scale(0.96) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
        </div>
    );
};
export default ConfirmDialog;
