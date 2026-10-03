import { motion } from 'framer-motion';

const Privacy = () => (
    <div className="min-h-screen bg-cream-50 pt-20">
        <div className="bg-cinnamon-900 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-cinnamon-400 text-sm font-medium uppercase tracking-widest mb-2">Your Privacy Matters</p>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white">Privacy Policy</h1>
                <p className="text-cream-200/60 text-sm mt-4">Last updated: October 2026</p>
            </div>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
            <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10 space-y-8 text-sm text-gray-600 leading-relaxed">
                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">1. Introduction</h2>
                    <p>PURE GOLD Products ("we", "us", "our") is committed to protecting and respecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you visit our website or make a purchase.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">2. Information We Collect</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and billing details when you place an order or create an account.</li>
                        <li><strong>Usage Data:</strong> Pages visited, time spent on site, browser type, and device information collected through cookies and analytics.</li>
                        <li><strong>Communication Data:</strong> Messages sent via our contact form or customer support channels.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">3. How We Use Your Information</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>To process and fulfil your orders</li>
                        <li>To communicate order updates, shipping notifications, and delivery confirmations</li>
                        <li>To improve our website, products, and customer experience</li>
                        <li>To send marketing communications (only with your consent — you can unsubscribe at any time)</li>
                        <li>To prevent fraud and ensure security</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">4. Data Sharing</h2>
                    <p>We do not sell your personal data. We may share information with trusted third parties only as necessary to operate our business:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Payment processors (PayHere, Stripe) — to process transactions securely</li>
                        <li>Shipping carriers — to deliver your orders</li>
                        <li>Analytics services (Google Analytics) — to understand website usage</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">5. Cookies</h2>
                    <p>Our website uses cookies to enhance your experience, store your cart, and analyse site traffic. You can manage cookie preferences through your browser settings.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">6. Data Security</h2>
                    <p>We implement industry-standard security measures including HTTPS encryption, secure payment gateways, and access controls to protect your personal information.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">7. Your Rights</h2>
                    <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:privacy@ceylone.com" className="text-cinnamon-600 underline">privacy@ceylone.com</a>.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">8. Contact Us</h2>
                    <p>For questions about this policy, email us at <a href="mailto:privacy@ceylone.com" className="text-cinnamon-600 underline">privacy@ceylone.com</a> or write to: PURE GOLD Products, Galle, Sri Lanka.</p>
                </section>
            </div>
        </motion.div>
    </div>
);

export default Privacy;
