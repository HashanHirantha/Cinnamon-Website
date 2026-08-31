import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/images';

const ProductShowcase = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-20 lg:py-32 bg-cream-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9 }}
                    >
                        <p className="text-cinnamon-600 text-sm font-semibold uppercase tracking-widest mb-4">
                            Premium Collection
                        </p>
                        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-cinnamon-900 leading-tight mb-6">
                            Bring the Essence of
                            <span className="text-cinnamon-600"> Sri Lanka</span> Home
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Each PURE GOLD product carries within it the warmth of the Sri Lankan sun, the scent of tropical gardens, and the heritage of a culture that has perfected the art of cinnamon for over 2000 years.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/shop"
                                className="inline-flex items-center justify-center gap-3 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-premium hover:shadow-lg group"
                            >
                                Shop Cinnamon
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center justify-center gap-3 border-2 border-cinnamon-200 text-cinnamon-700 hover:border-cinnamon-600 font-semibold px-8 py-4 rounded-2xl transition-all"
                            >
                                Our Story
                            </Link>
                        </div>

                        {/* Mini badges */}
                        <div className="flex flex-wrap gap-3 mt-8">
                            {['No Additives', 'Vacuum Sealed', 'Export Grade', 'Sri Lankan Origin'].map((tag) => (
                                <span key={tag} className="px-3 py-1.5 bg-cinnamon-100 text-cinnamon-800 text-xs font-medium rounded-full border border-cinnamon-200">
                                    ✓ {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Main image */}
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative z-10 rounded-3xl overflow-hidden shadow-premium aspect-square max-w-lg mx-auto"
                        >
                            <img
                                src={IMAGES.showcase}
                                alt="Premium PURE GOLD cinnamon product"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cinnamon-900/40 via-transparent to-transparent" />
                        </motion.div>

                        {/* Floating decorative items */}
                        <motion.div
                            animate={{ y: [0, -8, 0], rotate: [0, 5, -3, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="absolute top-8 -left-8 w-20 h-20 bg-white rounded-2xl shadow-card flex items-center justify-center text-4xl"
                        >
                            🌿
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0], rotate: [0, -5, 3, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                            className="absolute bottom-10 -right-6 w-20 h-20 bg-white rounded-2xl shadow-card flex items-center justify-center text-4xl"
                        >
                            🍂
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            className="absolute top-1/2 -right-10 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3"
                        >
                            <span className="text-2xl">⭐</span>
                            <div>
                                <p className="text-xs font-bold text-gray-900">4.9/5</p>
                                <p className="text-xs text-gray-500">500+ reviews</p>
                            </div>
                        </motion.div>

                        {/* Background glow */}
                        <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
                            <div className="w-full h-full bg-cinnamon-300 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
