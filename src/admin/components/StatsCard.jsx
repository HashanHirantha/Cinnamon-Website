// Stats Card for dashboard metrics
const StatsCard = ({ label, value, icon, change, changeLabel, color = '#92400e', prefix = '', suffix = '' }) => {
    const isPositive = change >= 0;
    return (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                    <p style={{ margin: '6px 0 0', color: '#111827', fontSize: '26px', fontWeight: '700' }}>
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </p>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {icon}
                </div>
            </div>
            {change !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: isPositive ? '#16a34a' : '#dc2626' }}>
                        {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>{changeLabel || 'vs last period'}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
