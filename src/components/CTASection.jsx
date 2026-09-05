import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/images';
import ctaBgImage from '../assets/auth/cinnamon-sticks-powder.jpg';

const CTASection = () => {
    return (
        <section className="relative py-28 lg:py-40 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={ctaBgImage}
                    alt="Ceylon Cinnamon"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cinnamon-950/95 via-cinnamon-900/85 to-cinnamon-950/95" />
            </div>

            {/* Decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cinnamon-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-cream-200 text-xs font-medium px-4 py-2 rounded-full mb-8">
                        🌿 Grown in Sri Lanka · Delivered Worldwide
                    </div>

                    <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        Discover the{' '}
                        <span className="text-gold-400">True Taste</span>
                        <br />
                        of Ceylon
                    </h2>

                    <p className="text-cream-200/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                        Join thousands of discerning customers around the world who have made CEYLONÉ their trusted source for authentic, premium-grade Ceylon cinnamon.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/shop"
                            className="group inline-flex items-center justify-center gap-3 bg-cinnamon-500 hover:bg-cinnamon-400 text-white font-semibold text-lg px-10 py-5 rounded-2xl transition-all shadow-premium hover:shadow-2xl hover:scale-105"
                        >
                            Shop Cinnamon
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/about"
                            className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-lg px-10 py-5 rounded-2xl transition-all"
                        >
                            Learn More
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
