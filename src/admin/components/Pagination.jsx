// Pagination component
const Pagination = ({ page, totalPages, onPage }) => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);

    const btn = (label, onClick, disabled, active) => (
        <button key={label} onClick={onClick} disabled={disabled} style={{
            padding: '7px 12px', border: '1px solid', borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
            background: active ? '#92400e' : disabled ? '#f9fafb' : '#fff',
            color: active ? '#fff' : disabled ? '#d1d5db' : '#374151',
            borderColor: active ? '#92400e' : '#e5e7eb',
            fontSize: '13px', fontWeight: active ? '600' : '400', minWidth: '36px',
        }}>
            {label}
        </button>
    );

    return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            {btn('←', () => onPage(page - 1), page === 1)}
            {pages.map((p) => btn(p, () => onPage(p), false, p === page))}
            {btn('→', () => onPage(page + 1), page === totalPages)}
        </div>
    );
};

export default Pagination;
