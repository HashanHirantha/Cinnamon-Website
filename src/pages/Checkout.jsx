import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from '../components/Toast';

const steps = ['Customer Info', 'Shipping', 'Payment'];

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(0);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);

    const shipping = cartTotal >= 50 ? 0 : 8.99;
    const grandTotal = cartTotal + shipping;

    const [form, setForm] = useState({
        fullName: '', email: '', phone: '',
        address: '', city: '', postalCode: '', country: '',
        cardNumber: '', expiry: '', cvv: '', cardName: '',
    });

    const handleInput = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const nextStep = () => {
        if (step < steps.length - 1) setStep(s => s + 1);
        else placeOrder();
    };

    const placeOrder = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOrderPlaced(true);
            clearCart();
            toast.success('Order placed successfully! 🎉');
        }, 2000);
    };

    const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (v) => {
        const digits = v.replace(/\D/g, '').slice(0, 4);
        return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-cinnamon-900 mb-3">Order Confirmed!</h2>
                    <p className="text-gray-500 mb-2">Thank you for shopping with CEYLONÉ.</p>
                    <p className="text-gray-500 mb-8">Your premium Ceylon cinnamon is being prepared with care. A confirmation email will be sent to you shortly.</p>
                    <div className="bg-cinnamon-50 rounded-2xl p-4 mb-8 text-left">
                        <p className="text-sm text-cinnamon-800 font-medium">Order Reference: <span className="font-bold">CCE-{Math.floor(Math.random() * 90000) + 10000}</span></p>
                        <p className="text-xs text-gray-500 mt-1">Estimated delivery: 7-14 business days</p>
                    </div>
                    <Link
                        to="/shop"
                        className="inline-flex items-center bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
                    >
                        Continue Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-50 pt-20">
            <div className="bg-cinnamon-900 py-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-serif text-3xl font-bold text-white mb-4">Checkout</h1>
                    {/* Step indicator */}
                    <div className="flex items-center gap-3">
                        {steps.map((s, i) => (
                            <div key={s} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? 'bg-cinnamon-400 text-white' : 'bg-cinnamon-800 text-cream-400'}`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className={`text-sm font-medium ${i <= step ? 'text-cream-100' : 'text-cream-400'}`}>{s}</span>
                                {i < steps.length - 1 && <div className={`flex-1 h-0.5 w-8 ${i < step ? 'bg-cinnamon-400' : 'bg-cinnamon-800'}`} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-card p-8">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Step 0: Customer Info */}
                                {step === 0 && (
                                    <div className="space-y-5">
                                        <h2 className="font-serif text-xl font-bold text-cinnamon-900">Customer Information</h2>
                                        {[
                                            { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                                            { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                                            { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900' },
                                        ].map(({ name, label, type, placeholder }) => (
                                            <div key={name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                                                <input
                                                    type={type}
                                                    name={name}
                                                    value={form[name]}
                                                    onChange={handleInput}
                                                    placeholder={placeholder}
                                                    className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Step 1: Shipping */}
                                {step === 1 && (
                                    <div className="space-y-5">
                                        <h2 className="font-serif text-xl font-bold text-cinnamon-900">Shipping Address</h2>
                                        {[
                                            { name: 'address', label: 'Street Address', placeholder: '123 Main Street, Apt 4B' },
                                            { name: 'city', label: 'City', placeholder: 'New York' },
                                            { name: 'postalCode', label: 'Postal / ZIP Code', placeholder: '10001' },
                                            { name: 'country', label: 'Country', placeholder: 'United States' },
                                        ].map(({ name, label, placeholder }) => (
                                            <div key={name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                                                <input
                                                    type="text"
                                                    name={name}
                                                    value={form[name]}
                                                    onChange={handleInput}
                                                    placeholder={placeholder}
                                                    className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Step 2: Payment */}
                                {step === 2 && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="font-serif text-xl font-bold text-cinnamon-900">Payment</h2>
                                            <CreditCard className="w-5 h-5 text-cinnamon-500" />
                                        </div>

                                        {/* Demo notice */}
                                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                                            <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-800">
                                                <strong>Frontend prototype only.</strong> Secure payment powered by our payment partner. No real card data is stored or processed.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={form.cardNumber}
                                                onChange={(e) => setForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all font-mono tracking-wider"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    value={form.expiry}
                                                    onChange={(e) => setForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    value={form.cvv}
                                                    onChange={handleInput}
                                                    placeholder="•••"
                                                    maxLength={4}
                                                    className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all font-mono"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                value={form.cardName}
                                                onChange={handleInput}
                                                placeholder="Name on card"
                                                className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-cinnamon-400 focus:ring-2 focus:ring-cinnamon-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream-200">
                                {step > 0 ? (
                                    <button
                                        onClick={() => setStep(s => s - 1)}
                                        className="px-6 py-3 text-sm font-medium text-cinnamon-700 border border-cinnamon-200 rounded-xl hover:bg-cinnamon-50 transition-colors"
                                    >
                                        ← Back
                                    </button>
                                ) : (
                                    <Link to="/cart" className="px-6 py-3 text-sm font-medium text-cinnamon-700 border border-cinnamon-200 rounded-xl hover:bg-cinnamon-50 transition-colors">
                                        ← Back to Cart
                                    </Link>
                                )}
                                <button
                                    onClick={nextStep}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-premium disabled:opacity-50"
                                >
                                    {loading ? (
                                        <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Processing...</>
                                    ) : step < steps.length - 1 ? `Continue →` : '🔒 Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order summary sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-card p-6">
                            <h3 className="font-serif text-lg font-bold text-cinnamon-900 mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-cinnamon-700 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-cream-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-cinnamon-900 text-base border-t border-cream-200 pt-2">
                                    <span>Total</span><span>${grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
