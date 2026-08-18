import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            return alert('Passwords do not match!');
        }
        setLoading(true);
        setTimeout(() => { setLoading(false); navigate('/account'); }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-cinnamon-50 flex items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="font-serif text-3xl font-bold text-cinnamon-900 tracking-widest">CEYLONÉ</Link>
                    <p className="text-sm text-gray-500 mt-2">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                    ].map(({ name, label, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                            <input
                                type={type}
                                required
                                value={form[name]}
                                onChange={(e) => setForm(p => ({ ...p, [name]: e.target.value }))}
                                placeholder={placeholder}
                                className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                required
                                value={form.password}
                                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                                placeholder="Create a password"
                                className="w-full border border-cream-300 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={form.confirm}
                            onChange={(e) => setForm(p => ({ ...p, confirm: e.target.value }))}
                            placeholder="Confirm your password"
                            className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-premium disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Creating account...</>
                        ) : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-cinnamon-600 font-semibold hover:text-cinnamon-800 transition-colors">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
