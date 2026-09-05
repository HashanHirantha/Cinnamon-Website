// Pure SVG Sales Chart — no external dependencies
import { useState, useMemo } from 'react';

const COLORS = { line: '#92400e', area: 'rgba(146,64,14,0.08)', point: '#d97706', grid: '#f0f0f0', label: '#9ca3af' };

const SalesChart = ({ data, title = 'Sales Overview', showPeriodSelector = true }) => {
    const [period, setPeriod] = useState('week');

    const chartData = data ? data[period] : [];
    const WIDTH = 620, HEIGHT = 220, PAD = { top: 20, right: 20, bottom: 36, left: 56 };
    const innerW = WIDTH - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;

    const { maxVal, points, pathD, areaD } = useMemo(() => {
        if (!chartData || chartData.length === 0) return { maxVal: 0, points: [], pathD: '', areaD: '' };
        const maxVal = Math.max(...chartData.map((d) => d.revenue)) * 1.15;
        const points = chartData.map((d, i) => ({
            x: PAD.left + (i / (chartData.length - 1)) * innerW,
            y: PAD.top + innerH - (d.revenue / maxVal) * innerH,
            label: d.label,
            revenue: d.revenue,
        }));
        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const areaD = pathD + ` L ${points[points.length - 1].x} ${PAD.top + innerH} L ${points[0].x} ${PAD.top + innerH} Z`;
        return { maxVal, points, pathD, areaD };
    }, [chartData]);

    const gridLines = 4;
    const periods = [{ k: 'today', l: 'Today' }, { k: 'week', l: '7 Days' }, { k: 'month', l: '30 Days' }, { k: 'year', l: '12 Months' }];

    return (
        <div style={{ background: '#fff', borderRadius: '14px', padding: '20px 20px 16px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>{title}</h3>
                {showPeriodSelector && (
                    <div style={{ display: 'flex', gap: '4px', background: '#f9fafb', borderRadius: '10px', padding: '4px' }}>
                        {periods.map((p) => (
                            <button key={p.k} onClick={() => setPeriod(p.k)} style={{
                                padding: '5px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                                background: period === p.k ? '#fff' : 'transparent',
                                color: period === p.k ? '#92400e' : '#6b7280',
                                boxShadow: period === p.k ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            }}>{p.l}</button>
                        ))}
                    </div>
                )}
            </div>
            <div style={{ overflowX: 'auto' }}>
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', minWidth: '300px', display: 'block' }}>
                    {/* Grid lines */}
                    {Array.from({ length: gridLines + 1 }, (_, i) => {
                        const y = PAD.top + (i / gridLines) * innerH;
                        const val = Math.round(maxVal * (1 - i / gridLines));
                        return (
                            <g key={i}>
                                <line x1={PAD.left} y1={y} x2={PAD.left + innerW} y2={y} stroke={COLORS.grid} strokeWidth="1" />
                                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill={COLORS.label}>${(val / 1000 >= 1 ? (val / 1000).toFixed(1) + 'k' : val)}</text>
                            </g>
                        );
                    })}
                    {/* Area fill */}
                    {areaD && <path d={areaD} fill={COLORS.area} />}
                    {/* Line */}
                    {pathD && <path d={pathD} fill="none" stroke={COLORS.line} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
                    {/* Points + labels */}
                    {points.map((p, i) => {
                        const showLabel = points.length <= 12 || i % Math.ceil(points.length / 12) === 0;
                        return (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r="3.5" fill={COLORS.point} stroke="#fff" strokeWidth="1.5" />
                                {showLabel && (
                                    <text x={p.x} y={HEIGHT - 8} textAnchor="middle" fontSize="10" fill={COLORS.label}>{p.label}</text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default SalesChart;
