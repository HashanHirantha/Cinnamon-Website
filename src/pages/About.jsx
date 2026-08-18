import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { IMAGES } from '../data/images';
import CTASection from '../components/CTASection';

const About = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center overflow-hidden">
                <img src={IMAGES.about_hero} alt="About CEYLONÉ" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-cinnamon-900/80" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-cinnamon-400 text-sm font-semibold uppercase tracking-widest mb-4">Our Story</p>
                        <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight">
                            The Heart Behind<br /><span className="text-gold-400">CEYLONÉ</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section ref={ref} className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                        <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
                            <p className="text-cinnamon-600 text-sm font-semibold uppercase tracking-widest mb-4">How We Started</p>
                            <h2 className="font-serif text-4xl font-bold text-cinnamon-900 mb-6">From a Cinnamon Garden to the World</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>CEYLONÉ was born from a simple but powerful conviction: that the world deserves to experience <strong>true</strong> Ceylon cinnamon — not the cassia imitation sold under the same name in most grocery stores.</p>
                                <p>Our founder, raised in a family that has worked in cinnamon cultivation in the Southern Province of Sri Lanka for four generations, witnessed firsthand the extraordinary quality and heritage of what grew in their own gardens.</p>
                                <p>The vision was clear: to build a brand that would honour the chalias (cinnamon peelers), sustain the farms, and bring the finest Ceylon cinnamon directly to discerning customers across the world.</p>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
                            <img src={IMAGES.about_farm} alt="Sri Lanka cinnamon farm" className="rounded-3xl shadow-premium w-full h-96 object-cover" loading="lazy" />
                        </motion.div>
                    </div>

                    {/* Values */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        {[
                            { emoji: '🌿', title: 'Our Mission', text: 'To bring 100% authentic Ceylon cinnamon to the world while supporting Sri Lankan farmers and preserving the ancient craft of cinnamon cultivation.' },
                            { emoji: '🌍', title: 'Our Vision', text: 'To become the world\'s most trusted name in Ceylon cinnamon, synonymous with purity, heritage, and premium quality.' },
                            { emoji: '💛', title: 'Our Values', text: 'Authenticity, sustainability, community, and an unwavering commitment to quality in everything we do.' },
                        ].map(({ emoji, title, text }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                                className="text-center p-8 bg-cream-50 rounded-2xl border border-cream-200"
                            >
                                <div className="text-5xl mb-5">{emoji}</div>
                                <h3 className="font-serif text-xl font-bold text-cinnamon-900 mb-3">{title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Farmers */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <img src={IMAGES.about_farmers} alt="Sri Lankan farmers" className="rounded-3xl shadow-premium w-full h-96 object-cover order-2 lg:order-1" loading="lazy" />
                        <div className="order-1 lg:order-2">
                            <p className="text-cinnamon-600 text-sm font-semibold uppercase tracking-widest mb-4">Our People</p>
                            <h2 className="font-serif text-4xl font-bold text-cinnamon-900 mb-6">Honouring the Chalias</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>The <strong>chalias</strong> are the master cinnamon peelers of Sri Lanka — skilled artisans whose craft has been passed through families for generations. Their work is extraordinary: each quill is formed entirely by hand with nothing but knives and skill, the inner bark rolled into perfect cylinders that are then dried under the tropical sun.</p>
                                <p>At CEYLONÉ, we pay our partner chalias fairly and directly — no middlemen, no exploitation. Their welfare and the sustainability of their craft are inseparable from our own success.</p>
                                <p>When you choose CEYLONÉ, you choose to support these remarkable people and their way of life.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    );
};

export default About;
