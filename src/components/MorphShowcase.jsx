import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

// ─── Featured products with per-slide theme ──────────────────────────────────
const THEME = [
    { bg: '#2c1008', accent: '#d97706', blob: '#3d1a0a', text: '#fef3c7' },
    { bg: '#1c1207', accent: '#b45309', blob: '#2d1d09', text: '#fef9c3' },
    { bg: '#0f2010', accent: '#65a30d', blob: '#182a10', text: '#f0fdf4' },
    { bg: '#200c0c', accent: '#dc2626', blob: '#321010', text: '#fef2f2' },
    { bg: '#160c24', accent: '#9333ea', blob: '#200f38', text: '#faf5ff' },
    { bg: '#1a1106', accent: '#ca8a04', blob: '#2a1c08', text: '#fefce8' },
];

// ─── Organic SVG blob paths (each is unique shape) ───────────────────────────
const BLOBS = [
    'M420,280Q390,310,360,340Q330,370,290,380Q250,390,210,375Q170,360,140,330Q110,300,105,260Q100,220,120,185Q140,150,175,130Q210,110,255,105Q300,100,335,125Q370,150,400,185Q430,220,420,280Z',
    'M400,260Q385,320,335,350Q285,380,235,370Q185,360,155,320Q125,280,130,235Q135,190,165,160Q195,130,245,115Q295,100,335,125Q375,150,395,200Q415,250,400,260Z',
    'M415,265Q400,330,350,360Q300,390,250,375Q200,360,165,320Q130,280,135,230Q140,180,170,150Q200,120,250,110Q300,100,340,130Q380,160,405,210Q430,260,415,265Z',
    'M430,270Q405,340,350,365Q295,390,245,370Q195,350,160,310Q125,270,130,220Q135,170,170,140Q205,110,255,108Q305,106,345,135Q385,164,415,215Q445,266,430,270Z',
    'M410,260Q390,325,340,358Q290,391,238,378Q186,365,152,322Q118,279,125,228Q132,177,165,148Q198,119,248,110Q298,101,340,128Q382,155,406,207Q430,259,410,260Z',
    'M425,265Q400,335,345,362Q290,389,240,372Q190,355,158,315Q126,275,130,225Q134,175,168,147Q202,119,252,110Q302,101,342,130Q382,159,408,210Q434,261,425,265Z',
];

const featured = products.filter(p => p.featured);
const PANEL_HEIGHT = 100; // vh per product

// ─── Dot indicator ────────────────────────────────────────────────────────────
const Dot = ({ active, accent, onClick }) => (
    <button onClick={onClick} className="relative flex items-center justify-center w-8 h-8 group" aria-label="Go to slide">
        <motion.span
            animate={{ scale: active ? 1 : 0.55, opacity: active ? 1 : 0.5 }}
            transition={{ duration: 0.35 }}
            className="block rounded-full w-3 h-3 transition-all"
            style={{ background: active ? accent : '#ffffff55' }}
        />
        {active && (
            <motion.span
                layoutId="dot-ring"
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: accent }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
        )}
    </button>
);

// ─── Thumbnail card ───────────────────────────────────────────────────────────
const Thumb = ({ product, active, accent, onClick }) => (
    <button
        onClick={onClick}
        className="relative flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300"
        style={{
            width: active ? 72 : 54,
            height: active ? 72 : 54,
            outline: active ? `2px solid ${accent}` : '2px solid transparent',
            outlineOffset: 2,
        }}
        aria-label={product.name}
    >
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {!active && <div className="absolute inset-0 bg-black/40" />}
    </button>
);

// ─── Main component ───────────────────────────────────────────────────────────
const MorphShowcase = () => {
    const sectionRef = useRef(null);
    const { addToCart } = useCart();
    const [activeIdx, setActiveIdx] = useState(0);

    const totalHeight = featured.length * PANEL_HEIGHT;

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });

    // Keep activeIdx in sync with scroll
    useEffect(() => {
        const unsub = scrollYProgress.on('change', v => {
            const raw = v * featured.length;
            const idx = Math.min(Math.floor(raw), featured.length - 1);
            setActiveIdx(idx);
        });
        return unsub;
    }, [scrollYProgress]);

    // Scroll to a product panel
    const jumpTo = idx => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const target = top + (idx / featured.length) * sectionRef.current.offsetHeight;
        window.scrollTo({ top: target, behavior: 'smooth' });
    };

    const theme = THEME[activeIdx] ?? THEME[0];

    return (
        // Outer wrapper sets the scroll height
        <div ref={sectionRef} style={{ height: `${totalHeight}vh` }} className="relative">
            {/* ── Sticky viewport ── */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* ── Animated background ── */}
                <motion.div
                    className="absolute inset-0 transition-colors"
                    animate={{ backgroundColor: theme.bg }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                />

                {/* ── Blob decorations (top-left) ── */}
                <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.svg
                            key={activeIdx + '-blob'}
                            viewBox="0 0 500 500"
                            className="absolute -left-24 -top-16 w-[680px] h-[680px] opacity-70"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 0.7, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                        >
                            <path d={BLOBS[activeIdx] ?? BLOBS[0]} fill={theme.blob} />
                        </motion.svg>
                    </AnimatePresence>
                </div>

                {/* ── Subtle grid texture ── */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />

                {/* ── Content ── */}
                <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                        {/* ── LEFT: text + thumbnails ── */}
                        <div className="flex flex-col justify-center">
                            {/* Section label */}
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={activeIdx + '-label'}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45, delay: 0.05 }}
                                    className="text-xs font-semibold tracking-[0.3em] uppercase mb-4"
                                    style={{ color: theme.accent }}
                                >
                                    Featured Collection · {activeIdx + 1} / {featured.length}
                                </motion.p>
                            </AnimatePresence>

                            {/* Product name */}
                            <div className="overflow-hidden mb-6">
                                <AnimatePresence mode="wait">
                                    <motion.h2
                                        key={activeIdx + '-name'}
                                        initial={{ y: 80, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -60, opacity: 0 }}
                                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                        className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                                        style={{ color: theme.text }}
                                    >
                                        {featured[activeIdx]?.name.split('—')[0].trim()}
                                    </motion.h2>
                                </AnimatePresence>
                            </div>

                            {/* Short description */}
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={activeIdx + '-desc'}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.45, delay: 0.1 }}
                                    className="text-base lg:text-lg leading-relaxed mb-8 max-w-sm opacity-80"
                                    style={{ color: theme.text }}
                                >
                                    {featured[activeIdx]?.shortDescription}
                                </motion.p>
                            </AnimatePresence>

                            {/* Rating + price row */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIdx + '-meta'}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.4, delay: 0.15 }}
                                    className="flex items-center gap-6 mb-8"
                                >
                                    {/* Stars */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4"
                                                fill={i < Math.round(featured[activeIdx]?.rating) ? theme.accent : 'transparent'}
                                                stroke={theme.accent}
                                            />
                                        ))}
                                        <span className="text-sm ml-1 opacity-70" style={{ color: theme.text }}>
                                            ({featured[activeIdx]?.reviewCount})
                                        </span>
                                    </div>
                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold" style={{ color: theme.accent }}>
                                            ${featured[activeIdx]?.price.toFixed(2)}
                                        </span>
                                        {featured[activeIdx]?.originalPrice && (
                                            <span className="text-sm line-through opacity-50" style={{ color: theme.text }}>
                                                ${featured[activeIdx].originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* CTA buttons */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIdx + '-cta'}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="flex flex-wrap gap-3 mb-10"
                                >
                                    <button
                                        onClick={() => addToCart(featured[activeIdx])}
                                        className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                                        style={{ background: theme.accent, color: '#fff' }}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                    <Link
                                        to={`/shop/${featured[activeIdx]?.slug}`}
                                        className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-2xl border transition-all duration-200 hover:scale-105 group"
                                        style={{ borderColor: `${theme.text}33`, color: theme.text }}
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            </AnimatePresence>

                            {/* Thumbnail strip */}
                            <div className="flex items-center gap-3">
                                {featured.map((p, i) => (
                                    <Thumb
                                        key={p.id}
                                        product={p}
                                        active={i === activeIdx}
                                        accent={theme.accent}
                                        onClick={() => jumpTo(i)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── RIGHT: product image ── */}
                        <div className="relative flex items-center justify-center h-[55vh] lg:h-[70vh]">
                            {/* Glow behind image */}
                            <motion.div
                                className="absolute w-72 h-72 rounded-full blur-3xl opacity-30"
                                animate={{ backgroundColor: theme.accent }}
                                transition={{ duration: 0.9 }}
                            />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIdx + '-img'}
                                    initial={{ opacity: 0, scale: 0.82, y: 40, rotate: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 1.08, y: -30, rotate: 3 }}
                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative z-10 w-full max-w-sm lg:max-w-md"
                                >
                                    <img
                                        src={featured[activeIdx]?.image}
                                        alt={featured[activeIdx]?.name}
                                        className="w-full h-auto object-cover rounded-3xl shadow-2xl"
                                        style={{ aspectRatio: '4/3' }}
                                    />

                                    {/* Badge */}
                                    {featured[activeIdx]?.badge && (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full"
                                            style={{ background: theme.accent, color: '#fff' }}
                                        >
                                            {featured[activeIdx].badge}
                                        </motion.span>
                                    )}

                                    {/* Weight pill */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                        className="absolute -bottom-4 left-6 bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full"
                                    >
                                        {featured[activeIdx]?.weight} · {featured[activeIdx]?.origin}
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Floating particles */}
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full opacity-20"
                                    style={{
                                        width: 8 + i * 6,
                                        height: 8 + i * 6,
                                        top: `${15 + i * 20}%`,
                                        left: `${i % 2 === 0 ? 5 : 75}%`,
                                        backgroundColor: theme.accent,
                                    }}
                                    animate={{ y: [0, -14, 0], x: [0, i % 2 === 0 ? 8 : -8, 0] }}
                                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right side dot navigation ── */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1">
                    {featured.map((_, i) => (
                        <Dot key={i} active={i === activeIdx} accent={theme.accent} onClick={() => jumpTo(i)} />
                    ))}
                </div>

                {/* ── Progress bar (top) ── */}
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-30" style={{ background: theme.bg }}>
                    <motion.div
                        className="h-full"
                        style={{ background: theme.accent }}
                        animate={{ width: `${((activeIdx + 1) / featured.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* ── Scroll hint (only on first product) ── */}
                <AnimatePresence>
                    {activeIdx === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                        >
                            <p className="text-xs tracking-widest uppercase opacity-40" style={{ color: theme.text }}>Scroll</p>
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5"
                            >
                                <div className="w-1 h-2 rounded-full" style={{ background: theme.text + '99' }} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MorphShowcase;
