// Admin Dashboard — Overview page
import { useState } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import StatsCard from '../../admin/components/StatsCard';
import SalesChart from '../../admin/components/SalesChart';
import StatusBadge from '../../admin/components/StatusBadge';
import PageHeader from '../../admin/components/PageHeader';
import { mockOrders, salesData } from '../../admin/data/mockData';
import { useProducts } from '../../hooks/useProducts';

const BestSellers = ({ products }) => {
    const top = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
    return (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>Best Selling Products</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {top.map((p, i) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: i < 3 ? '#fef3c7' : '#f3f4f6', color: i < 3 ? '#92400e' : '#6b7280', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                        {p.image && <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', textTransform: 'capitalize' }}>{p.category}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#16a34a' }}>${p.price.toFixed(2)}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{p.reviewCount} reviews</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LowStockAlert = ({ products }) => {
    const low = products.filter((p) => p.inStock && p.stock < 50).sort((a, b) => a.stock - b.stock).slice(0, 5);
    if (low.length === 0) return null;
    return (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #fde68a', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>⚠️ Low Stock Alert</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#9ca3af' }}>Products below minimum stock level</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {low.map((p) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#111827', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: p.stock < 20 ? '#dc2626' : '#d97706' }}>{p.stock} left</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { products } = useProducts();
    const totalRevenue = mockOrders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
    const todayRevenue = mockOrders.filter((o) => o.date === '2026-09-05' && o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
    const pendingOrders = mockOrders.filter((o) => o.orderStatus === 'pending').length;
    const lowStock = products.filter((p) => p.stock < 50).length;

    return (
        <AdminLayout>
            <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening in your store." />

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <StatsCard label="Total Revenue" value={totalRevenue} prefix="$" icon="💰" change={12.5} changeLabel="vs last month" color="#16a34a" />
                <StatsCard label="Today's Revenue" value={todayRevenue} prefix="$" icon="📅" change={-3.2} changeLabel="vs yesterday" color="#0369a1" />
                <StatsCard label="Total Orders" value={mockOrders.length} icon="🛍️" change={8.1} color="#7c3aed" />
                <StatsCard label="Pending Orders" value={pendingOrders} icon="⏳" color="#d97706" />
                <StatsCard label="Total Products" value={products.length} icon="📦" change={2} color="#0891b2" />
                <StatsCard label="Low Stock" value={lowStock} icon="⚠️" color="#dc2626" />
                <StatsCard label="Total Customers" value={8} icon="👥" change={15} color="#7c3aed" />
            </div>

            {/* Chart */}
            <div style={{ marginBottom: '24px' }}>
                <SalesChart data={salesData} title="Revenue Overview" />
            </div>

            {/* Recent orders + best sellers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', marginBottom: '24px' }} className="dash-grid">
                {/* Recent Orders */}
                <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>Recent Orders</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                {['Order ID', 'Customer', 'Amount', 'Payment', 'Status'].map((h) => (
                                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockOrders.slice(0, 6).map((o) => (
                                <tr key={o.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                    <td style={{ padding: '10px 12px', color: '#92400e', fontWeight: '600', whiteSpace: 'nowrap' }}>{o.id}</td>
                                    <td style={{ padding: '10px 12px', color: '#374151' }}>{o.customer}</td>
                                    <td style={{ padding: '10px 12px', color: '#111827', fontWeight: '600', whiteSpace: 'nowrap' }}>${o.total.toFixed(2)}</td>
                                    <td style={{ padding: '10px 12px' }}><StatusBadge status={o.paymentStatus} /></td>
                                    <td style={{ padding: '10px 12px' }}><StatusBadge status={o.orderStatus} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <BestSellers products={products} />
            </div>

            <LowStockAlert products={products} />

            <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </AdminLayout>
    );
};

export default AdminDashboard;
