import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({ columns, data, searchable = true, searchPlaceholder = 'Search...', emptyMessage = 'No data found' }) => {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filtered = useMemo(() => {
        let result = data;
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(row =>
                columns.some(col => {
                    const val = col.accessor ? (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]) : '';
                    return String(val).toLowerCase().includes(q);
                })
            );
        }
        if (sortKey) {
            const col = columns.find(c => c.key === sortKey);
            if (col && col.accessor) {
                result = [...result].sort((a, b) => {
                    const aVal = typeof col.accessor === 'function' ? col.accessor(a) : a[col.accessor];
                    const bVal = typeof col.accessor === 'function' ? col.accessor(b) : b[col.accessor];
                    if (typeof aVal === 'number' && typeof bVal === 'number') {
                        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
                    }
                    return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
                });
            }
        }
        return result;
    }, [data, search, sortKey, sortDir, columns]);

    return (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {/* Search bar */}
            {searchable && (
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 outline-none transition-all bg-gray-50"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && col.accessor && handleSort(col.key)}
                                    className={`px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.sortable !== false && col.accessor ? 'cursor-pointer hover:text-gray-700 select-none' : ''} ${col.className || ''}`}
                                >
                                    <span className="flex items-center gap-1">
                                        {col.header}
                                        {sortKey === col.key && (
                                            sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-5 py-12 text-center text-gray-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((row, idx) => (
                                <tr key={row.id || idx} className="hover:bg-cream-50/60 transition-colors">
                                    {columns.map(col => (
                                        <td key={col.key} className={`px-5 py-4 ${col.className || ''}`}>
                                            {col.render ? col.render(row) : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                Showing {filtered.length} of {data.length} entries
            </div>
        </div>
    );
};

export default DataTable;
