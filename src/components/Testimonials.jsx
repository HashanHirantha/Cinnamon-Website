import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { reviews } from '../data/reviews';
import ReviewCard from './ReviewCard';

const Testimonials = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-20 lg:py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <p className="text-cinnamon-600 text-sm font-semibold uppercase tracking-widest mb-3">
                        From Our Community
                    </p>
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold text-cinnamon-900 mb-4">
                        Loved Worldwide
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Real experiences from customers across the globe who have discovered the extraordinary difference of true Ceylon cinnamon.
                    </p>
                </motion.div>

                {/* Review grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                        >
                            <ReviewCard review={review} />
                        </motion.div>
                    ))}
                </div>

                {/* Trust numbers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { value: '5,000+', label: 'Happy Customers' },
                        { value: '14+', label: 'Countries Served' },
                        { value: '4.9/5', label: 'Average Rating' },
                        { value: '98%', label: 'Would Recommend' },
                    ].map(({ value, label }) => (
                        <div key={label} className="text-center p-5 bg-cream-50 rounded-2xl border border-cream-200">
                            <p className="font-serif text-3xl font-bold text-cinnamon-700 mb-1">{value}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
