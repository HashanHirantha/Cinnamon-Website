import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RotateCcw, Clock, CheckCircle, XCircle, Mail } from 'lucide-react';

const Returns = () => (
    <div className="min-h-screen bg-cream-50 pt-20">
        <div className="bg-cinnamon-900 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-cinnamon-400 text-sm font-medium uppercase tracking-widest mb-2">Hassle-Free Returns</p>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white">Returns & Refunds</h1>
            </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            {/* Key points */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-3 gap-6">
                {[
                    { icon: <RotateCcw className="w-6 h-6" />, title: '30-Day Returns', desc: 'Return unopened items within 30 days' },
                    { icon: <Clock className="w-6 h-6" />, title: 'Quick Refunds', desc: 'Refunds processed within 5–7 business days' },
                    { icon: <CheckCircle className="w-6 h-6" />, title: 'Quality Guarantee', desc: 'Full refund if product quality is compromised' },
                ].map((item) => (
                    <div key={item.title} className="bg-white rounded-2xl p-6 shadow-card text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-cinnamon-100 text-cinnamon-700 flex items-center justify-center">{item.icon}</div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </motion.div>

            {/* Policy */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl shadow-card p-8 space-y-6">
                <h2 className="font-serif text-2xl font-bold text-cinnamon-900">Return Policy</h2>
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p>We want you to be 100% satisfied with your PURE GOLD Products purchase. If for any reason you are not satisfied, we offer the following return and refund options:</p>

                    <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2"><CheckCircle className="w-4 h-4 text-forest-600" /> Eligible for Return</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Unopened, sealed products in their original packaging</li>
                        <li>Items damaged during shipping (photo evidence required)</li>
                        <li>Incorrect items received</li>
                        <li>Products that have passed their expiry date upon receipt</li>
                    </ul>

                    <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Not Eligible for Return</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Opened or partially consumed products (unless quality is compromised)</li>
                        <li>Gift cards or promotional items</li>
                        <li>Items returned after 30 days of delivery</li>
                    </ul>

                    <h3 className="font-semibold text-gray-900 text-base">How to Request a Return</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>Email us at <a href="mailto:returns@ceylone.com" className="text-cinnamon-600 underline">returns@ceylone.com</a> with your order number and reason for return.</li>
                        <li>We'll reply within 24 hours with return instructions.</li>
                        <li>Ship the item(s) back — we'll provide a prepaid shipping label for damaged/incorrect items.</li>
                        <li>Once received and inspected, your refund will be processed to the original payment method.</li>
                    </ol>
                </div>
            </motion.div>

            <div className="text-center">
                <p className="text-gray-500 text-sm mb-4">Have questions about a return?</p>
                <Link to="/contact" className="inline-flex items-center gap-2 bg-cinnamon-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-cinnamon-700 transition-colors">
                    <Mail className="w-4 h-4" /> Contact Us
                </Link>
            </div>
        </div>
    </div>
);

export default Returns;
