import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulated login - connect to real auth later
        setTimeout(() => {
            setLoading(false);
            navigate('/account');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-cinnamon-50 flex items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="font-serif text-3xl font-bold text-cinnamon-900 tracking-widest">CEYLONÉ</Link>
                    <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
                </div>

                {/* Google login (UI only) */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border-2 border-cream-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-cream-50 transition-all mb-6"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="relative flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-cream-200" />
                    <span className="text-xs text-gray-400">or sign in with email</span>
                    <div className="flex-1 h-px bg-cream-200" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                            placeholder="you@example.com"
                            className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                required
                                value={form.password}
                                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                                placeholder="Your password"
                                className="w-full border border-cream-300 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" className="accent-cinnamon-600 rounded" checked={form.remember} onChange={(e) => setForm(p => ({ ...p, remember: e.target.checked }))} />
                            Remember me
                        </label>
                        <button type="button" className="text-sm text-cinnamon-600 hover:text-cinnamon-800 font-medium transition-colors">
                            Forgot password?
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-premium disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Signing in...</>
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-cinnamon-600 font-semibold hover:text-cinnamon-800 transition-colors">
                        Create account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
