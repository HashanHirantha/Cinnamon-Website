import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductGrid from '../components/ProductGrid';

const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' },
];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
    const [sort, setSort] = useState('featured');
    const [priceMax, setPriceMax] = useState(200);
    const [filterOpen, setFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Simulate loading
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    // Sync URL params
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        if (categoryParam) setActiveCategory(categoryParam);
        if (searchParam) setSearch(searchParam);
    }, [searchParams]);

    const filtered = useMemo(() => {
        let result = [...products];
        if (activeCategory && activeCategory !== 'all') {
            result = result.filter((p) => p.category === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.shortDescription.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.includes(q))
            );
        }
        result = result.filter((p) => p.price <= priceMax);
        switch (sort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
        return result;
    }, [activeCategory, search, sort, priceMax]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams(search ? { search } : {});
    };

    const clearFilters = () => {
        setSearch('');
        setActiveCategory('all');
        setSort('featured');
        setPriceMax(200);
        setSearchParams({});
    };

    const hasActiveFilters = search || activeCategory !== 'all' || priceMax < 200;

    const FilterPanel = () => (
        <aside className="space-y-8">
            {/* Category */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Category</h3>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === 'all' ? 'bg-cinnamon-100 text-cinnamon-800 font-semibold' : 'text-gray-600 hover:bg-cream-100'}`}
                        >
                            All Products ({products.length})
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <button
                                onClick={() => setActiveCategory(cat.slug)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat.slug ? 'bg-cinnamon-100 text-cinnamon-800 font-semibold' : 'text-gray-600 hover:bg-cream-100'}`}
                            >
                                {cat.name} ({products.filter(p => p.category === cat.id).length})
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                    Max Price: <span className="text-cinnamon-700">${priceMax}</span>
                </h3>
                <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-cinnamon-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$5</span>
                    <span>$200</span>
                </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Clear All Filters
                </button>
            )}
        </aside>
    );

    return (
        <div className="min-h-screen bg-cream-50 pt-20">
            {/* Page header */}
            <div className="bg-cinnamon-900 py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-cinnamon-400 text-sm font-medium uppercase tracking-widest mb-2">CEYLONÉ Collection</p>
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-3">Shop Ceylon Cinnamon</h1>
                    <p className="text-cream-200/70 text-base">Premium, authentic, and naturally sourced from Sri Lanka</p>
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-cream-200/50">
                        <span>Home</span>
                        <span>/</span>
                        <span className="text-cream-200">Shop</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 min-w-[220px] max-w-sm flex items-center bg-white border border-cream-200 rounded-xl px-4 py-2.5 gap-2 shadow-card">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </form>

                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setFilterOpen(true)}
                        className="flex lg:hidden items-center gap-2 bg-white border border-cream-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 shadow-card"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>

                    {/* Sort */}
                    <div className="relative ml-auto">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none bg-white border border-cream-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 shadow-card outline-none cursor-pointer"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Count */}
                    <p className="text-sm text-gray-500 hidden sm:block ml-2">
                        Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <div className="hidden lg:block w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
                            <FilterPanel />
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="flex-1">
                        <ProductGrid products={filtered} loading={loading} emptyMessage="No products match your search or filters." />
                    </div>
                </div>
            </div>

            {/* Mobile filter drawer */}
            {filterOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex"
                >
                    <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 30 }}
                        className="relative bg-white w-72 max-w-full h-full overflow-y-auto p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-lg font-bold text-cinnamon-900">Filters</h3>
                            <button onClick={() => setFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <FilterPanel />
                        <button
                            onClick={() => setFilterOpen(false)}
                            className="mt-6 w-full py-3 bg-cinnamon-600 text-white rounded-xl font-medium hover:bg-cinnamon-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Shop;
