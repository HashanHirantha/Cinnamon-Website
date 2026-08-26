import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

// ─── Shared input field ───────────────────────────────────────────────────────
const Field = ({ icon: Icon, type = 'text', placeholder, value, onChange, rightEl }) => (
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
            type={type}
            required
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-100 rounded-xl pl-11 pr-11 py-3.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-cinnamon-300 transition-all placeholder:text-gray-400"
        />
        {rightEl && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
    </div>
);

// ─── Panel variants ───────────────────────────────────────────────────────────
const formVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
};

// ─── Cinnamon background decoration ─────────────────────────────────────────
import img1 from '../assets/auth/cinnamon-sticks-powder.jpg';
import img2 from '../assets/auth/cinnamon-bag-lavender.jpg';
import img3 from '../assets/auth/cinnamon-bowl-leaves.jpg';
import img4 from '../assets/auth/anotherone.jpg';

const BgDecor = () => (
    <>
        {/* Deep ambient glow */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-cinnamon-700/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-amber-800/20 blur-3xl pointer-events-none" />

        {/* ── Photo 1: sticks & star anise & powder (flat lay) — top-left ── */}
        <motion.div
            animate={{ y: [0, -14, 0], rotate: [-6, -3, -6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 left-4 w-56 h-40 rounded-2xl overflow-hidden shadow-2xl pointer-events-none"
            style={{ opacity: 0.6 }}
        >
            <img src={img1} alt="" className="w-full h-full object-cover"
                style={{ filter: 'sepia(25%) saturate(1.3) brightness(0.72)' }} />
            <div className="absolute inset-0" style={{ background: 'rgba(110,45,8,0.32)', mixBlendMode: 'multiply' }} />
        </motion.div>

        {/* ── Photo 2: cinnamon bag with lavender — bottom-right ── */}
        <motion.div
            animate={{ y: [0, 18, 0], rotate: [7, 3, 7] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="absolute bottom-8 right-4 w-52 h-48 rounded-2xl overflow-hidden shadow-2xl pointer-events-none"
            style={{ opacity: 0.55 }}
        >
            <img src={img2} alt="" className="w-full h-full object-cover"
                style={{ filter: 'sepia(35%) saturate(1.3) brightness(0.68)' }} />
            <div className="absolute inset-0" style={{ background: 'rgba(100,38,5,0.38)', mixBlendMode: 'multiply' }} />
        </motion.div>

        {/* ── Photo 3: powder bowl, leaves & jar — bottom-left ── */}
        <motion.div
            animate={{ y: [0, -12, 0], x: [0, 5, 0], rotate: [4, 8, 4] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="absolute bottom-10 left-5 w-48 h-40 rounded-2xl overflow-hidden shadow-2xl pointer-events-none"
            style={{ opacity: 0.5 }}
        >
            <img src={img3} alt="" className="w-full h-full object-cover"
                style={{ filter: 'sepia(30%) saturate(1.4) brightness(0.70)' }} />
            <div className="absolute inset-0" style={{ background: 'rgba(120,55,8,0.33)', mixBlendMode: 'multiply' }} />
        </motion.div>

        {/* ── Photo 4: anotherone — top-right ── */}
        <motion.div
            animate={{ y: [0, -16, 0], rotate: [-4, -9, -4] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-6 right-4 w-52 h-40 rounded-2xl overflow-hidden shadow-2xl pointer-events-none"
            style={{ opacity: 0.55 }}
        >
            <img src={img4} alt="" className="w-full h-full object-cover"
                style={{ filter: 'sepia(28%) saturate(1.35) brightness(0.70)' }} />
            <div className="absolute inset-0" style={{ background: 'rgba(105,42,6,0.34)', mixBlendMode: 'multiply' }} />
        </motion.div>
    </>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const Login = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
    const [dir, setDir] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // Sign-in form state
    const [signIn, setSignIn] = useState({ email: '', password: '' });
    // Sign-up form state
    const [signUp, setSignUp] = useState({ name: '', email: '', password: '' });

    const switchTo = (next) => {
        setDir(next === 'signup' ? 1 : -1);
        setMode(next);
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); navigate('/account'); }, 1500);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); navigate('/account'); }, 1500);
    };

    // The coloured panel is on the RIGHT when signing in, LEFT when signing up
    const panelRight = mode === 'signin';

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, #3d1a0a 0%, #1a0a04 40%, #0f0703 100%)' }}>
            <BgDecor />
            {/* Card container */}
            <div className="relative w-full max-w-4xl min-h-[580px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">

                {/* ── Form panel (white side) ── */}
                <div
                    className="relative flex flex-col justify-center px-10 py-12 transition-all duration-700 w-1/2"
                    style={{ order: panelRight ? 1 : 2 }}
                >
                    <AnimatePresence mode="wait" custom={dir}>
                        {mode === 'signin' ? (
                            <motion.div
                                key="signin"
                                custom={dir}
                                variants={formVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full"
                            >
                                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-1">Sign In</h2>
                                <p className="text-sm text-gray-400 mb-7">Welcome back to Ceyloné</p>

                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <Field
                                        icon={Mail}
                                        type="email"
                                        placeholder="Enter E-mail"
                                        value={signIn.email}
                                        onChange={e => setSignIn(p => ({ ...p, email: e.target.value }))}
                                    />
                                    <Field
                                        icon={Lock}
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Enter Password"
                                        value={signIn.password}
                                        onChange={e => setSignIn(p => ({ ...p, password: e.target.value }))}
                                        rightEl={
                                            <button type="button" onClick={() => setShowPass(v => !v)} className="text-gray-400 hover:text-gray-600">
                                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        }
                                    />
                                    <div className="text-right">
                                        <button type="button" className="text-xs text-cinnamon-600 hover:text-cinnamon-800 font-medium">
                                            Forgot password?
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 tracking-wider text-sm uppercase"
                                    >
                                        {loading
                                            ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                                            : 'Sign In'}
                                    </button>
                                </form>

                                {/* Mobile-only switch */}
                                <p className="text-center text-sm text-gray-500 mt-6 lg:hidden">
                                    No account?{' '}
                                    <button onClick={() => switchTo('signup')} className="text-cinnamon-600 font-semibold">Sign Up</button>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                custom={dir}
                                variants={formVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full"
                            >
                                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-1">Create Account</h2>
                                <p className="text-sm text-gray-400 mb-7">Join the Ceyloné family</p>

                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <Field
                                        icon={User}
                                        placeholder="Full Name"
                                        value={signUp.name}
                                        onChange={e => setSignUp(p => ({ ...p, name: e.target.value }))}
                                    />
                                    <Field
                                        icon={Mail}
                                        type="email"
                                        placeholder="Enter E-mail"
                                        value={signUp.email}
                                        onChange={e => setSignUp(p => ({ ...p, email: e.target.value }))}
                                    />
                                    <Field
                                        icon={Lock}
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Create Password"
                                        value={signUp.password}
                                        onChange={e => setSignUp(p => ({ ...p, password: e.target.value }))}
                                        rightEl={
                                            <button type="button" onClick={() => setShowPass(v => !v)} className="text-gray-400 hover:text-gray-600">
                                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        }
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 tracking-wider text-sm uppercase"
                                    >
                                        {loading
                                            ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                                            : 'Sign Up'}
                                    </button>
                                </form>

                                <p className="text-center text-sm text-gray-500 mt-6 lg:hidden">
                                    Have an account?{' '}
                                    <button onClick={() => switchTo('signin')} className="text-cinnamon-600 font-semibold">Sign In</button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Coloured morph panel ── */}
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 140, damping: 22, mass: 1.1 }}
                    className="relative w-1/2 flex flex-col items-center justify-center px-10 py-12 overflow-hidden"
                    style={{ order: panelRight ? 2 : 1 }}
                >
                    {/* Animated gradient background */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            background: panelRight
                                ? 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #d97706 100%)'
                                : 'linear-gradient(135deg, #d97706 0%, #c2410c 50%, #7c2d12 100%)',
                        }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />

                    {/* Blob decorations */}
                    <motion.div
                        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 bg-white"
                        animate={{ scale: panelRight ? 1 : 1.2 }}
                        transition={{ duration: 0.8 }}
                    />
                    <motion.div
                        className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full opacity-10 bg-white"
                        animate={{ scale: panelRight ? 1.1 : 1 }}
                        transition={{ duration: 0.8 }}
                    />

                    {/* Panel content */}
                    <AnimatePresence mode="wait">
                        {panelRight ? (
                            <motion.div
                                key="panel-signin"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                                className="relative z-10 text-center text-white"
                            >
                                <Link to="/" className="font-serif text-2xl font-bold tracking-widest mb-6 block opacity-90">CEYLONÉ</Link>
                                <h3 className="font-serif text-3xl font-bold mb-3 leading-tight">
                                    Hello,<br />Welcome!
                                </h3>
                                <p className="text-sm opacity-75 mb-8 leading-relaxed">
                                    Don't have an account yet?<br />Sign up to explore pure Ceylon cinnamon.
                                </p>
                                <button
                                    onClick={() => switchTo('signup')}
                                    className="border-2 border-white text-white font-bold px-10 py-3 rounded-xl hover:bg-white hover:text-cinnamon-700 transition-all duration-300 tracking-wider text-sm uppercase"
                                >
                                    Sign Up
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="panel-signup"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                                className="relative z-10 text-center text-white"
                            >
                                <Link to="/" className="font-serif text-2xl font-bold tracking-widest mb-6 block opacity-90">CEYLONÉ</Link>
                                <h3 className="font-serif text-3xl font-bold mb-3 leading-tight">
                                    Welcome<br />Back!
                                </h3>
                                <p className="text-sm opacity-75 mb-8 leading-relaxed">
                                    Already have an account?<br />Sign in to continue your journey.
                                </p>
                                <button
                                    onClick={() => switchTo('signin')}
                                    className="border-2 border-white text-white font-bold px-10 py-3 rounded-xl hover:bg-white hover:text-cinnamon-700 transition-all duration-300 tracking-wider text-sm uppercase"
                                >
                                    Sign In
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
