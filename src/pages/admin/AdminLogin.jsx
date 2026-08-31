import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            if (form.username === 'admin' && form.password === '1234') {
                localStorage.setItem('puregold_admin_auth', JSON.stringify({ loggedIn: true, user: 'admin' }));
                navigate('/admin');
            } else {
                setError('Invalid username or password');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cinnamon-900 via-cinnamon-800 to-cinnamon-900 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold-400 blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-cinnamon-500 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cinnamon-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="w-10 h-10 bg-gold-400 rounded-lg flex items-center justify-center">
                            <span className="text-cinnamon-900 font-bold text-lg">PG</span>
                        </div>
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-cinnamon-900 tracking-wide">PURE GOLD Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Admin Dashboard Login</p>
                </div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={form.username}
                                onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
                                placeholder="Enter username"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-cream-200 focus:border-cinnamon-500 focus:ring-2 focus:ring-cinnamon-100 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={form.password}
                                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                                placeholder="Enter password"
                                className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-cream-200 focus:border-cinnamon-500 focus:ring-2 focus:ring-cinnamon-100 outline-none transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cinnamon-600 hover:bg-cinnamon-700 disabled:bg-cinnamon-400 text-white font-semibold py-3.5 rounded-xl transition-all shadow-premium hover:shadow-lg text-sm"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : 'Sign In to Dashboard'}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} PURE GOLD Products · Admin Panel
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
