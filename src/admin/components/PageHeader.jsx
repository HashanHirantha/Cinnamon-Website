// Page Header — title + breadcrumb + right actions
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => (
    <div style={{ marginBottom: '24px' }}>
        {breadcrumbs.length > 0 && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                {breadcrumbs.map((crumb, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {i > 0 && <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" width="14" height="14"><path d="M9 18l6-6-6-6" /></svg>}
                        {crumb.href ? (
                            <Link to={crumb.href} style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>{crumb.label}</Link>
                        ) : (
                            <span style={{ color: '#374151', fontSize: '13px', fontWeight: '500' }}>{crumb.label}</span>
                        )}
                    </span>
                ))}
            </nav>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
                <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#111827' }}>{title}</h1>
                {subtitle && <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>{subtitle}</p>}
            </div>
            {actions && <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>{actions}</div>}
        </div>
    </div>
);

export default PageHeader;
