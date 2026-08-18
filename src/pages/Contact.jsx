import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from '../components/Toast';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setForm({ name: '', email: '', phone: '', message: '' });
            toast.success('Message sent! We\'ll get back to you within 24 hours.');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-cream-50 pt-20">
            {/* Header */}
            <div className="bg-cinnamon-900 py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-cinnamon-400 text-sm font-medium uppercase tracking-widest mb-2">We'd Love to Hear From You</p>
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white">Contact Us</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <div className="bg-white rounded-3xl shadow-card p-8">
                            <h2 className="font-serif text-2xl font-bold text-cinnamon-900 mb-6">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {[
                                    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                                    { name: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+1 234 567' },
                                ].map(({ name, label, type, placeholder }) => (
                                    <div key={name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                                        <input
                                            type={type}
                                            value={form[name]}
                                            onChange={(e) => setForm(p => ({ ...p, [name]: e.target.value }))}
                                            placeholder={placeholder}
                                            required={name !== 'phone'}
                                            className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        value={form.message}
                                        onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                                        placeholder="How can we help you?"
                                        className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-premium disabled:opacity-60"
                                >
                                    {loading ? (
                                        <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Sending...</>
                                    ) : (
                                        <><Send className="w-4 h-4" /> Send Message</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact info */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-card p-8">
                            <h2 className="font-serif text-2xl font-bold text-cinnamon-900 mb-6">Get in Touch</h2>
                            <div className="space-y-5">
                                {[
                                    { Icon: Mail, label: 'Email', value: 'hello@ceylone.com', href: 'mailto:hello@ceylone.com' },
                                    { Icon: Phone, label: 'Phone', value: '+94 77 123 4567', href: 'tel:+94771234567' },
                                    { Icon: MapPin, label: 'Location', value: '42 Cinnamon Lane, Galle 80000, Sri Lanka 🇱🇰' },
                                ].map(({ Icon, label, value, href }) => (
                                    <div key={label} className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-cinnamon-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-cinnamon-700" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                                            {href ? (
                                                <a href={href} className="text-sm text-gray-800 hover:text-cinnamon-700 transition-colors">{value}</a>
                                            ) : (
                                                <p className="text-sm text-gray-800">{value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map placeholder */}
                        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
                            <div className="h-64 w-full bg-gradient-to-br from-forest-100 to-cinnamon-100 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502303103293-96a25eb15f1e?w=600&q=60')] bg-cover bg-center opacity-50" />
                                <div className="relative z-10 text-center">
                                    <div className="w-14 h-14 bg-cinnamon-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                        <MapPin className="w-7 h-7 text-white" />
                                    </div>
                                    <p className="font-serif text-lg font-bold text-cinnamon-900">Galle, Sri Lanka</p>
                                    <p className="text-xs text-gray-600 mt-1">Interactive map coming soon</p>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="bg-cinnamon-50 border border-cinnamon-100 rounded-2xl p-5">
                            <p className="font-semibold text-cinnamon-900 text-sm mb-3">Business Hours</p>
                            <div className="space-y-1.5 text-sm text-gray-600">
                                <div className="flex justify-between"><span>Monday – Friday</span><span>8:00 AM – 6:00 PM (IST)</span></div>
                                <div className="flex justify-between"><span>Saturday</span><span>9:00 AM – 4:00 PM (IST)</span></div>
                                <div className="flex justify-between text-gray-400"><span>Sunday</span><span>Closed</span></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
