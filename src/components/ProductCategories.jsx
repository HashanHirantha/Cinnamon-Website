import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CategoryCard from './CategoryCard';
import { categories } from '../data/categories';

const ProductCategories = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: '-80px' });

    return (
        <section ref={ref} className="py-20 lg:py-32 bg-cream-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <p className="text-cinnamon-600 text-sm font-semibold uppercase tracking-widest mb-3">
                        Browse By Category
                    </p>
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold text-cinnamon-900">
                        Explore Our Range
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            <CategoryCard category={cat} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCategories;
