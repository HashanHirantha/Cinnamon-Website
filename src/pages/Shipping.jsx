import { motion } from 'framer-motion';
import { Truck, Globe, Clock, Package, MapPin } from 'lucide-react';

const zones = [
    { region: 'Sri Lanka (Domestic)', days: '2–4 business days', rate: 'Free over LKR 5,000', icon: '🇱🇰' },
    { region: 'South Asia (India, Bangladesh, Maldives)', days: '5–8 business days', rate: 'From $6.99', icon: '🌏' },
    { region: 'Middle East & Gulf', days: '5–10 business days', rate: 'From $9.99', icon: '🕌' },
    { region: 'Europe (EU & UK)', days: '7–14 business days', rate: 'From $12.99', icon: '🇪🇺' },
    { region: 'United States & Canada', days: '7–14 business days', rate: 'From $14.99', icon: '🇺🇸' },
    { region: 'Australia & New Zealand', days: '10–18 business days', rate: 'From $14.99', icon: '🇦🇺' },
];

const Shipping = () => (
    <div className="min-h-screen bg-cream-50 pt-20">
        <div className="bg-cinnamon-900 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-cinnamon-400 text-sm font-medium uppercase tracking-widest mb-2">Worldwide Delivery</p>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white">Shipping Information</h1>
            </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            {/* Key promises */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="grid sm:grid-cols-3 gap-6"
            >
                {[
                    { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', desc: 'On orders over $50 (international) or LKR 5,000 (domestic)' },
                    { icon: <Clock className="w-6 h-6" />, title: 'Fast Processing', desc: 'Orders processed within 1–2 business days' },
                    { icon: <Package className="w-6 h-6" />, title: 'Secure Packaging', desc: 'Vacuum-sealed, food-grade packaging for freshness' },
                ].map((item) => (
                    <div key={item.title} className="bg-white rounded-2xl p-6 shadow-card text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-cinnamon-100 text-cinnamon-700 flex items-center justify-center">{item.icon}</div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </motion.div>

            {/* Zones */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-serif text-2xl font-bold text-cinnamon-900 mb-6">Delivery Zones & Estimated Times</h2>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-cinnamon-50 text-left">
                                <th className="px-6 py-4 font-semibold text-gray-700">Region</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Estimated Delivery</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Shipping Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {zones.map((z, i) => (
                                <tr key={z.region} className={i % 2 === 0 ? 'bg-white' : 'bg-cream-50'}>
                                    <td className="px-6 py-4 font-medium text-gray-800">{z.icon} {z.region}</td>
                                    <td className="px-6 py-4 text-gray-600">{z.days}</td>
                                    <td className="px-6 py-4 text-cinnamon-700 font-semibold">{z.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Notes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-card p-8">
                <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-4">Important Notes</h2>
                <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-cinnamon-500 mt-0.5 flex-shrink-0" /> All orders ship from our facility in Galle, Southern Sri Lanka.</li>
                    <li className="flex items-start gap-3"><Globe className="w-4 h-4 text-cinnamon-500 mt-0.5 flex-shrink-0" /> Import duties and taxes may apply for international orders. These are the buyer's responsibility.</li>
                    <li className="flex items-start gap-3"><Package className="w-4 h-4 text-cinnamon-500 mt-0.5 flex-shrink-0" /> A tracking number will be emailed to you once your order is dispatched.</li>
                    <li className="flex items-start gap-3"><Clock className="w-4 h-4 text-cinnamon-500 mt-0.5 flex-shrink-0" /> During peak seasons (December–January), deliveries may take 2–5 additional days.</li>
                </ul>
            </motion.div>
        </div>
    </div>
);

export default Shipping;
