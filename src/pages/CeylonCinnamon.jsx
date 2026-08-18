import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { IMAGES } from '../data/images';
import CTASection from '../components/CTASection';

const CeylonCinnamon = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <section className="relative h-[55vh] flex items-center overflow-hidden">
                <img src={IMAGES.hero_main} alt="Ceylon Cinnamon" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-cinnamon-950/80" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-cinnamon-400 text-sm font-semibold uppercase tracking-widest mb-4">Knowledge Centre</p>
                        <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight">
                            What is <span className="text-gold-400">Ceylon Cinnamon?</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section ref={ref} className="py-20 lg:py-32">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Intro */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-16">
                        <p className="font-serif text-xl text-cinnamon-800 leading-relaxed max-w-3xl mx-auto">
                            Ceylon Cinnamon (<em>Cinnamomum verum</em>), often called "true cinnamon," is the world's most prized variety of cinnamon — and Sri Lanka is its sole original home.
                        </p>
                    </motion.div>

                    {/* Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 mb-20">
                        {[
                            {
                                title: '✅ Ceylon Cinnamon',
                                subtitle: 'Cinnamomum verum — True Cinnamon',
                                color: 'border-cinnamon-600 bg-cinnamon-50',
                                items: [
                                    'Delicately sweet, complex flavour',
                                    'Thin, brittle, multi-layered quills',
                                    'Virtually no coumarin (liver-safe)',
                                    'Grown exclusively in Sri Lanka',
                                    'Lighter tan-brown colour',
                                ],
                            },
                            {
                                title: '❌ Cassia Cinnamon',
                                subtitle: 'Cinnamomum cassia — Common Imitation',
                                color: 'border-gray-300 bg-gray-50',
                                items: [
                                    'Harsh, pungent, one-dimensional taste',
                                    'Thick, hard, solid or semi-hollow sticks',
                                    'High coumarin (potential liver risk)',
                                    'Grown in China, Indonesia, Vietnam',
                                    'Dark reddish-brown colour',
                                ],
                            },
                        ].map(({ title, subtitle, color, items }) => (
                            <div key={title} className={`border-2 ${color} rounded-2xl p-7`}>
                                <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">{title}</h3>
                                <p className="text-xs text-gray-500 italic mb-5">{subtitle}</p>
                                <ul className="space-y-2.5">
                                    {items.map((item) => (
                                        <li key={item} className="text-sm text-gray-700 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cinnamon-500 flex-shrink-0 mt-1.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Facts */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
                        {[
                            { value: '~90%', label: 'of global Ceylon cinnamon supply comes from Sri Lanka' },
                            { value: '0.004%', label: 'typical coumarin content (US cassia can be 5000x higher)' },
                            { value: '2000+', label: 'years of cinnamon cultivation recorded in Sri Lanka' },
                        ].map(({ value, label }) => (
                            <div key={value} className="text-center p-6 bg-cinnamon-50 rounded-2xl border border-cinnamon-100">
                                <p className="font-serif text-4xl font-bold text-cinnamon-700 mb-2">{value}</p>
                                <p className="text-sm text-gray-600 leading-snug">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Health info */}
                    <div className="bg-forest-50 border border-forest-200 rounded-3xl p-8 mb-12">
                        <h2 className="font-serif text-2xl font-bold text-forest-900 mb-4">🌿 A Note on Health Claims</h2>
                        <p className="text-sm text-forest-800 leading-relaxed">
                            While Ceylon cinnamon has long been associated with traditional Ayurvedic and Unani medicine, CEYLONÉ does not make medical or therapeutic claims about our products. Our cinnamon is a premium spice and food ingredient. Please consult a qualified healthcare professional for any health-related queries. We are committed to transparency and factual communication.
                        </p>
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    );
};

export default CeylonCinnamon;
