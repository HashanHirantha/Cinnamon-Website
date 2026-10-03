import { motion } from 'framer-motion';

const Terms = () => (
    <div className="min-h-screen bg-cream-50 pt-20">
        <div className="bg-cinnamon-900 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-cinnamon-400 text-sm font-medium uppercase tracking-widest mb-2">Legal</p>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white">Terms of Service</h1>
                <p className="text-cream-200/60 text-sm mt-4">Last updated: October 2026</p>
            </div>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
            <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10 space-y-8 text-sm text-gray-600 leading-relaxed">
                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">1. Agreement to Terms</h2>
                    <p>By accessing or using the PURE GOLD Products website ("Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">2. Products & Pricing</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>All product descriptions and images are as accurate as possible, but we do not guarantee that colours and details displayed on your screen will perfectly match the physical product.</li>
                        <li>Prices are listed in USD unless otherwise stated and are subject to change without notice.</li>
                        <li>We reserve the right to limit quantities or refuse any order at our discretion.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">3. Orders & Payments</h2>
                    <p>By placing an order, you represent that you are legally capable of entering into binding contracts. All orders are subject to acceptance and availability. Payment must be received before order processing begins.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">4. Shipping & Delivery</h2>
                    <p>Estimated delivery times are indicative and not guaranteed. PURE GOLD Products is not responsible for delays caused by customs, weather, or carrier issues. Risk of loss passes to you upon delivery to the carrier.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">5. Returns & Refunds</h2>
                    <p>Returns and refunds are governed by our Returns Policy. Unopened products may be returned within 30 days of delivery. Damaged or incorrect items are eligible for a full refund.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">6. Intellectual Property</h2>
                    <p>All content on this Site — including text, images, logos, and design — is the property of PURE GOLD Products and is protected by intellectual property laws. You may not reproduce, distribute, or modify any content without prior written consent.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">7. User Accounts</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You agree to provide accurate and current information when creating an account.</li>
                        <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">8. Limitation of Liability</h2>
                    <p>PURE GOLD Products shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to the use of the Site or products purchased through the Site.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">9. Governing Law</h2>
                    <p>These Terms shall be governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes will be subject to the exclusive jurisdiction of the courts of Sri Lanka.</p>
                </section>

                <section>
                    <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">10. Contact</h2>
                    <p>For questions regarding these Terms, contact us at <a href="mailto:legal@ceylone.com" className="text-cinnamon-600 underline">legal@ceylone.com</a>.</p>
                </section>
            </div>
        </motion.div>
    </div>
);

export default Terms;
