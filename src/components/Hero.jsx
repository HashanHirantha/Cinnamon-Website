import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield } from 'lucide-react';
import { IMAGES } from '../data/images';

// Decorative floating element
const FloatingSpice = ({ className, delay = 0, duration = 6 }) => (
    <motion.div
        className={`absolute pointer-events-none opacity-30 ${className}`}
        animate={{ y: [0, -18, 0], rotate: [0, 10, -5, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
        <Leaf className="w-8 h-8 text-cream-200" />
    </motion.div>
);

const Hero = () => {
    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.18 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={IMAGES.hero_main}
                    alt="Premium Ceylon Cinnamon"
                    className="w-full h-full object-cover"
                    priority="true"
                />
                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-cinnamon-900/90 via-cinnamon-900/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-cinnamon-900/80 via-transparent to-transparent" />
            </div>

            {/* Floating decorative elements */}
            <FloatingSpice className="top-1/4 right-1/4 hidden lg:block" delay={0} duration={7} />
            <FloatingSpice className="top-1/3 right-1/3 hidden lg:block" delay={1.5} duration={9} />
            <FloatingSpice className="bottom-1/3 right-1/5 hidden lg:block" delay={3} duration={6} />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                <div className="max-w-2xl">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Trust badge */}
                        <motion.div variants={itemVariants}>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-cream-100 text-xs font-medium px-4 py-2 rounded-full mb-6">
                                <Shield className="w-4 h-4 text-gold-400" />
                                100% Authentic Ceylon Cinnamon
                            </div>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6"
                        >
                            Pure
                            <br />
                            <span className="text-gold-400">Ceylon</span>
                            <br />
                            Cinnamon
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            variants={itemVariants}
                            className="text-cream-200 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg"
                        >
                            Nature's finest spice, grown in the{' '}
                            <span className="text-gold-400 font-medium">heart of Sri Lanka</span>.
                            Carefully harvested, traditionally processed, delivered to your door.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/shop"
                                className="group inline-flex items-center justify-center gap-3 bg-cinnamon-600 hover:bg-cinnamon-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-premium hover:shadow-lg hover:scale-105"
                            >
                                Explore Collection
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300"
                            >
                                Discover Our Story
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom scroll hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <p className="text-white/50 text-xs tracking-widest uppercase">Scroll</p>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-2 bg-white/60 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
