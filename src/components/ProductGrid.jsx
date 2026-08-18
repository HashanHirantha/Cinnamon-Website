import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const ProductGrid = ({ products, loading = false, emptyMessage = 'No products found.' }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
                        <div className="aspect-square bg-cream-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-3 bg-cream-200 rounded w-1/3" />
                            <div className="h-4 bg-cream-200 rounded w-3/4" />
                            <div className="h-3 bg-cream-200 rounded w-full" />
                            <div className="h-4 bg-cream-200 rounded w-1/2" />
                            <div className="h-10 bg-cream-200 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
            >
                <div className="w-24 h-24 mx-auto mb-6 bg-cream-100 rounded-full flex items-center justify-center">
                    <span className="text-5xl">🪹</span>
                </div>
                <p className="text-gray-500 text-lg">{emptyMessage}</p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
