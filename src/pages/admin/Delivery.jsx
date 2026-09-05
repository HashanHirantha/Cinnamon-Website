// Delivery Management Page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import StatusBadge from '../../admin/components/StatusBadge';
import Modal from '../../admin/components/Modal';
import ConfirmDialog from '../../admin/components/ConfirmDialog';
import { useAdminToast } from '../../admin/components/AdminToast';
import { mockDeliveryZones as initialZones, mockOrders } from '../../admin/data/mockData';

const STORAGE_KEY = 'ceylon_admin_delivery_zones';
const loadZones = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : initialZones; } catch { return initialZones; } };
const saveZones = (z) => localStorage.setItem(STORAGE_KEY, JSON.stringify(z));

const emptyZone = { zone: '', method: 'Economy', minDays: 5, maxDays: 10, charge: 0, freeAbove: null, status: 'active' };

const Btn = ({ children, onClick, variant = 'primary', style: s }) => {
    const styles = { primary: { background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none' }, ghost: { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' }, danger: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' } };
    return <button onClick={onClick} style={{ padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px', ...styles[variant], ...s }}>{children}</button>;
};

const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' };

const Delivery = () => {
    const addToast = useAdminToast();
    const [zones, setZones] = useState(loadZones);
    const [shipments, setShipments] = useState(mockOrders.filter((o) => ['shipped', 'processing', 'confirmed'].includes(o.orderStatus)));
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyZone);
    const [confirm, setConfirm] = useState(null);
    const [activeTab, setActiveTab] = useState('zones');

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSave = () => {
        if (!form.zone.trim()) { addToast('Zone name is required', 'error'); return; }
        if (modal === 'add') {
            const updated = [...zones, { ...form, id: Date.now(), charge: Number(form.charge), minDays: Number(form.minDays), maxDays: Number(form.maxDays), freeAbove: form.freeAbove ? Number(form.freeAbove) : null }];
            saveZones(updated); setZones(updated);
            addToast('Delivery zone added!', 'success');
        } else {
            const updated = zones.map((z) => z.id === form.id ? { ...form, charge: Number(form.charge), minDays: Number(form.minDays), maxDays: Number(form.maxDays), freeAbove: form.freeAbove ? Number(form.freeAbove) : null } : z);
            saveZones(updated); setZones(updated);
            addToast('Zone updated!', 'success');
        }
        setModal(null);
    };

    const handleDelete = () => {
        const updated = zones.filter((z) => z.id !== confirm.id);
        saveZones(updated); setZones(updated);
        addToast('Zone deleted.', 'error');
        setConfirm(null);
    };

    const toggleStatus = (zone) => {
        const updated = zones.map((z) => z.id === zone.id ? { ...z, status: z.status === 'active' ? 'inactive' : 'active' } : z);
        saveZones(updated); setZones(updated);
    };

    const tabStyle = (tab) => ({ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', background: activeTab === tab ? '#92400e' : 'transparent', color: activeTab === tab ? '#fff' : '#6b7280' });

    return (
        <AdminLayout>
            <PageHeader title="Delivery" subtitle="Manage delivery zones and track shipments" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Delivery' }]} actions={activeTab === 'zones' ? <Btn onClick={() => { setForm(emptyZone); setModal('add'); }}>＋ Add Zone</Btn> : null} />

            <div style={{ display: 'flex', gap: '4px', background: '#f9fafb', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '20px' }}>
                <button style={tabStyle('zones')} onClick={() => setActiveTab('zones')}>🗺️ Delivery Zones</button>
                <button style={tabStyle('shipments')} onClick={() => setActiveTab('shipments')}>📦 Active Shipments</button>
            </div>

            {activeTab === 'zones' && (
                <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                                {['Zone', 'Method', 'Delivery Time', 'Charge', 'Free Above', 'Status', 'Actions'].map((h) => (
                                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {zones.map((z) => (
                                <tr key={z.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                    <td style={{ padding: '12px 14px', fontWeight: '500', color: '#111827' }}>{z.zone}</td>
                                    <td style={{ padding: '12px 14px', color: '#374151' }}>{z.method}</td>
                                    <td style={{ padding: '12px 14px', color: '#374151' }}>{z.minDays}–{z.maxDays} days</td>
                                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#16a34a' }}>${z.charge.toFixed(2)}</td>
                                    <td style={{ padding: '12px 14px', color: '#6b7280' }}>{z.freeAbove ? `$${z.freeAbove}` : '—'}</td>
                                    <td style={{ padding: '12px 14px' }}><StatusBadge status={z.status} /></td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <Btn variant="ghost" style={{ padding: '5px 10px' }} onClick={() => { setForm(z); setModal('edit'); }}>✏️</Btn>
                                            <Btn variant={z.status === 'active' ? 'ghost' : 'primary'} style={{ padding: '5px 10px' }} onClick={() => toggleStatus(z)}>{z.status === 'active' ? '⏸' : '▶'}</Btn>
                                            <Btn variant="danger" style={{ padding: '5px 10px' }} onClick={() => setConfirm(z)}>🗑️</Btn>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'shipments' && (
                <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                                {['Order ID', 'Customer', 'Destination', 'Tracking', 'Status'].map((h) => (
                                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.length === 0 ? <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No active shipments.</td></tr>
                                : shipments.map((o) => (
                                    <tr key={o.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                        <td style={{ padding: '12px 14px', fontWeight: '600', color: '#92400e' }}>{o.id}</td>
                                        <td style={{ padding: '12px 14px', color: '#374151' }}>{o.customer}</td>
                                        <td style={{ padding: '12px 14px', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.deliveryAddress}</td>
                                        <td style={{ padding: '12px 14px', color: o.trackingNo ? '#0369a1' : '#9ca3af', fontWeight: o.trackingNo ? '600' : '400' }}>{o.trackingNo || '—'}</td>
                                        <td style={{ padding: '12px 14px' }}><StatusBadge status={o.orderStatus} /></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Delivery Zone' : 'Edit Delivery Zone'}
                footer={<><Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={handleSave}>💾 Save Zone</Btn></>}>
                <div>
                    {[['Zone Name *', 'zone', 'e.g. Europe'], ['Method', 'method', 'Economy'], ['Min Days', 'minDays', '5'], ['Max Days', 'maxDays', '14'], ['Charge ($)', 'charge', '10.00'], ['Free Shipping Above ($)', 'freeAbove', 'Leave blank if none']].map(([label, key, ph]) => (
                        <div key={key}>
                            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
                            <input value={form[key] ?? ''} onChange={set(key)} placeholder={ph} type={['minDays', 'maxDays', 'charge', 'freeAbove'].includes(key) ? 'number' : 'text'} style={inputStyle} />
                        </div>
                    ))}
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Status</label>
                    <select value={form.status} onChange={set('status')} style={{ ...inputStyle }}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </Modal>

            <ConfirmDialog open={!!confirm} title="Delete Zone?" message={`"${confirm?.zone}" will be deleted.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
        </AdminLayout>
    );
};

export default Delivery;
