import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGES } from '../data/images';

// ─── Per-transition Framer Motion variants ─────────────────────────────────
const slideVariants = {
    fade: {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } },
        exit: { opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
    },
    zoom: {
        enter: { opacity: 0, scale: 1.12 },
        center: { opacity: 1, scale: 1, transition: { duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] } },
        exit: { opacity: 0, scale: 0.96, transition: { duration: 0.9, ease: 'easeIn' } },
    },
    slideLeft: {
        enter: { opacity: 0, x: '100%' },
        center: { opacity: 1, x: 0, transition: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] } },
        exit: { opacity: 0, x: '-30%', transition: { duration: 0.8, ease: 'easeIn' } },
    },
    slideRight: {
        enter: { opacity: 0, x: '-100%' },
        center: { opacity: 1, x: 0, transition: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] } },
        exit: { opacity: 0, x: '30%', transition: { duration: 0.8, ease: 'easeIn' } },
    },
    morph: {
        enter: { opacity: 0, scale: 1.15, filter: 'blur(15px)' },
        center: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 0.85, filter: 'blur(15px)', transition: { duration: 1.2, ease: "easeInOut" } },
    }
};

// ─── Decorative floating element ────────────────────────────────────────────
const FloatingSpice = ({ className, delay = 0, duration = 6 }) => (
    <motion.div
        className={`absolute pointer-events-none opacity-30 ${className}`}
        animate={{ y: [0, -18, 0], rotate: [0, 10, -5, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
    </motion.div>
);

// ─── Single background slide ─────────────────────────────────────────────────
const Slide = ({ slide }) => {
    const variants = slideVariants[slide.transition] ?? slideVariants.fade;
    return (
        <motion.div
            key={slide.url}
            className="absolute inset-0"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
        >
            <img
                src={slide.url}
                alt={slide.label}
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
};

// ─── Hero ────────────────────────────────────────────────────────────────────
const AUTO_PLAY_INTERVAL = 5000;
const slides = IMAGES.heroSlides;

const typewriterContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const typewriterLetter = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 15, stiffness: 200 },
    },
};

const AnimatedText = ({ text, className, style }) => {
    return (
        <span className={className} style={style}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    variants={typewriterLetter}
                    className="inline-block whitespace-pre"
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};


const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [showControls, setShowControls] = useState(false);

    const goTo = useCallback((index) => {
        setCurrent((index + slides.length) % slides.length);
    }, []);

    const prev = useCallback(() => goTo(current - 1), [current, goTo]);
    const next = useCallback(() => goTo(current + 1), [current, goTo]);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => goTo(current + 1), AUTO_PLAY_INTERVAL);
        return () => clearInterval(timer);
    }, [current, goTo]);

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.18 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
    };

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* ── Slideshow background ── */}
            <AnimatePresence mode="sync">
                <Slide key={current} slide={slides[current]} />
            </AnimatePresence>

            {/* ── Floating decorative elements ── */}
            <FloatingSpice className="top-1/4 right-1/4 hidden lg:block" delay={0} duration={7} />
            <FloatingSpice className="top-1/3 right-1/3 hidden lg:block" delay={1.5} duration={9} />
            <FloatingSpice className="bottom-1/3 right-1/5 hidden lg:block" delay={3} duration={6} />

            {/* ── Prev / Next arrows ── */}
            <AnimatePresence>
                {showControls && (
                    <>
                        <motion.button
                            key="prev"
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.25 }}
                            onClick={prev}
                            aria-label="Previous slide"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 text-white transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </motion.button>
                        <motion.button
                            key="next"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: 0.25 }}
                            onClick={next}
                            aria-label="Next slide"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 text-white transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            {/* ── Main content ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center max-w-4xl"
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
                        variants={typewriterContainer}
                        className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 sm:whitespace-nowrap"
                    >
                        <AnimatedText text="Pure " />
                        <AnimatedText text="Ceylon" className="text-gold-400" />
                        <AnimatedText text=" Cinnamon" />
                    </motion.h1>

                </motion.div>
            </div>

            {/* ── Bottom Content (CTAs & Single Line Subtext) ── */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-7xl px-4 flex flex-col items-center justify-center">
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center w-full mb-6">
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

                {/* Subheading in Single Line */}
                <motion.p
                    variants={itemVariants}
                    className="text-cream-200 text-sm sm:text-base lg:text-lg whitespace-nowrap text-center opacity-90 tracking-wide"
                >
                    Nature's finest spice, grown in the <span className="text-gold-400 font-medium">heart of Sri Lanka</span>. Carefully harvested, traditionally processed, delivered to your door.
                </motion.p>
            </div>

            {/* ── Dot indicators ── */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="group relative flex items-center justify-center"
                    >
                        <motion.span
                            animate={{
                                width: i === current ? 28 : 8,
                                backgroundColor: i === current ? '#d97706' : 'rgba(255,255,255,0.5)',
                            }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="block h-2 rounded-full"
                            style={{ minWidth: 8 }}
                        />
                    </button>
                ))}
            </div>

            {/* ── Slide label ── */}
            {/* <AnimatePresence mode="wait">
                <motion.p
                    key={current}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-white/50 text-xs tracking-widest uppercase whitespace-nowrap"
                >
                    {slides[current].label}
                </motion.p>
            </AnimatePresence> */}

            {/* ── Scroll hint ── */}
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
        </section >
    );
};

export default Hero;
