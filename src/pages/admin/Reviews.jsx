// Reviews Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import ConfirmDialog from '../../admin/components/ConfirmDialog';
import { useAdminToast } from '../../admin/components/AdminToast';
import { mockReviews as initialReviews } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_reviews';
const loadReviews = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : initialReviews; } catch { return initialReviews; } };
const saveReviews = (rv) => localStorage.setItem(STORAGE_KEY, JSON.stringify(rv));

const Stars = ({ rating }) => (
    <span style={{ color: '#f59e0b', fontSize: '13px' }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
);

const Btn = ({ children, onClick, variant = 'primary', style: s }) => {
    const styles = { primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' }, ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' }, danger: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }, success: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' } };
    return <button onClick={onClick} style={{ padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px', ...styles[variant], ...s }}>{children}</button>;
};

const Reviews = () => {
    const addToast = useAdminToast();
    const [reviews, setReviews] = useState(loadReviews);
    const [filter, setFilter] = useState('all');
    const [confirm, setConfirm] = useState(null);

    const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);

    const updateStatus = (id, status) => {
        const updated = reviews.map((r) => r.id === id ? { ...r, status } : r);
        saveReviews(updated); setReviews(updated);
        addToast(`Review ${status}`, status === 'approved' ? 'success' : 'error');
    };

    const handleDelete = () => {
        const updated = reviews.filter((r) => r.id !== confirm.id);
        saveReviews(updated); setReviews(updated);
        addToast('Review deleted.', 'error');
        setConfirm(null);
    };

    const pending = reviews.filter((r) => r.status === 'pending').length;

    return (
        <AdminLayout>
            <PageHeader title="Reviews" subtitle={`${reviews.length} reviews · ${pending} pending approval`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Reviews' }]} />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '13px', fontWeight: '500', textTransform: 'capitalize', background: filter === f ? '#92400e' : '#fff', color: filter === f ? '#fff' : '#6b7280', borderColor: filter === f ? '#92400e' : '#e5e7eb' }}>
                        {f} {f === 'pending' && pending > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '11px', marginLeft: '4px' }}>{pending}</span>}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: '14px', padding: '48px', textAlign: 'center', color: '#9ca3af', border: '1px solid #f0f0f0' }}>No reviews in this category.</div>
                ) : filtered.map((r) => (
                    <div key={r.id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: `1px solid ${r.status === 'pending' ? '#fde68a' : '#f0f0f0'}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#92400e,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>{r.customer.charAt(0)}</div>
                                    <div>
                                        <span style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>{r.customer}</span>
                                        <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '8px' }}>on <span style={{ color: '#92400e' }}>{r.product}</span></span>
                                    </div>
                                    <Stars rating={r.rating} />
                                    <StatusBadge status={r.status} />
                                </div>
                                <p style={{ margin: '0 0 8px', color: '#374151', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.review}"</p>
                                <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px' }}>Submitted {r.date}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                {r.status !== 'approved' && <Btn variant="success" onClick={() => updateStatus(r.id, 'approved')}>✓ Approve</Btn>}
                                {r.status !== 'rejected' && <Btn variant="ghost" onClick={() => updateStatus(r.id, 'rejected')}>✗ Reject</Btn>}
                                <Btn variant="danger" onClick={() => setConfirm(r)}>🗑️</Btn>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmDialog open={!!confirm} title="Delete Review?" message={`This review from ${confirm?.customer} will be permanently deleted.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
        </AdminLayout>
    );
};

export default Reviews;
