// Reports & Analytics Page
import { useState, useMemo } from 'react';
import AdminLayout from '../../admin/components/AdminLayout';
import PageHeader from '../../admin/components/PageHeader';
import SalesChart from '../../admin/components/SalesChart';
import { salesData, mockOrders } from '../../admin/data/mockData';
import { useProducts } from '../../hooks/useProducts';

const Stat = ({ label, value, prefix = '', suffix = '', sub }) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: 0, color: '#9ca3af', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ margin: '6px 0 2px', fontSize: '22px', fontWeight: '700', color: '#111827' }}>{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</p>
        {sub && <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{sub}</p>}
    </div>
);

const Reports = () => {
    const { products } = useProducts();
    const [exportMsg, setExportMsg] = useState('');

    const paid = mockOrders.filter((o) => o.paymentStatus === 'paid');
    const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
    const avgOrder = paid.length ? totalRevenue / paid.length : 0;

    const bestProducts = useMemo(() => {
        const counts = {};
        mockOrders.forEach((o) => o.items.forEach((item) => {
            counts[item.name] = (counts[item.name] || 0) + item.qty;
        }));
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, []);

    const catRevenue = useMemo(() => {
        const rev = {};
        products.forEach((p) => { rev[p.category] = (rev[p.category] || 0) + p.price * 10; });
        return Object.entries(rev).sort((a, b) => b[1] - a[1]);
    }, [products]);

    const fakeCsv = () => {
        const header = 'Order ID,Customer,Date,Total,Status\n';
        const rows = mockOrders.map((o) => `${o.id},${o.customer},${o.date},${o.total.toFixed(2)},${o.orderStatus}`).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'ceylon-sales-report.csv'; a.click();
        URL.revokeObjectURL(url);
        setExportMsg('CSV downloaded!');
        setTimeout(() => setExportMsg(''), 3000);
    };

    return (
        <AdminLayout>
            <PageHeader title="Reports & Analytics" subtitle="Business performance overview" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Reports' }]}
                actions={
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {exportMsg && <span style={{ color: '#166534', fontSize: '13px', fontWeight: '600' }}>✅ {exportMsg}</span>}
                        <button onClick={fakeCsv} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#92400e,#d97706)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>📥 Export CSV</button>
                        <button onClick={() => { setExportMsg('PDF export would require a backend service'); setTimeout(() => setExportMsg(''), 4000); }} style={{ padding: '8px 16px', background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>📄 Export PDF</button>
                    </div>
                }
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                <Stat label="Total Revenue" value={totalRevenue} prefix="$" sub="All time" />
                <Stat label="Total Orders" value={mockOrders.length} sub="All time" />
                <Stat label="Avg Order Value" value={avgOrder} prefix="$" sub="Per order" />
                <Stat label="Paid Orders" value={paid.length} sub={`${Math.round(paid.length / mockOrders.length * 100)}% of total`} />
                <Stat label="Total Products" value={products.length} sub="In store" />
                <Stat label="Total Customers" value={8} sub="Registered" />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <SalesChart data={salesData} title="Revenue Trend" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Best-selling products */}
                <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>Best-Selling Products</h3>
                    {bestProducts.map(([name, qty], i) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: i < 3 ? '#fef3c7' : '#f3f4f6', color: i < 3 ? '#92400e' : '#6b7280', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                                <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px', marginTop: '4px' }}>
                                    <div style={{ height: '100%', background: '#92400e', borderRadius: '2px', width: `${Math.min(100, (qty / (bestProducts[0]?.[1] || 1)) * 100)}%` }} />
                                </div>
                            </div>
                            <span style={{ flexShrink: 0, fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{qty} units</span>
                        </div>
                    ))}
                </div>

                {/* Best categories */}
                <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>Revenue by Category</h3>
                    {catRevenue.slice(0, 5).map(([cat, rev], i) => (
                        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#111827', textTransform: 'capitalize' }}>{cat}</p>
                                <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px', marginTop: '4px' }}>
                                    <div style={{ height: '100%', background: '#0369a1', borderRadius: '2px', width: `${Math.min(100, (rev / (catRevenue[0]?.[1] || 1)) * 100)}%` }} />
                                </div>
                            </div>
                            <span style={{ flexShrink: 0, fontSize: '13px', fontWeight: '600', color: '#16a34a' }}>${rev.toFixed(0)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Reports;
