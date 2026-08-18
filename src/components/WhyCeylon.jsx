import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    MapPin, Leaf, Sparkles, Award, Recycle, Package
} from 'lucide-react';

const features = [
    {
        Icon: MapPin,
        title: 'Authentic Sri Lankan Origin',
        description: 'Sourced only from certified cinnamon farms in the Southern Province of Sri Lanka, the birthplace of true Ceylon cinnamon.',
    },
    {
        Icon: Leaf,
        title: 'Carefully Selected',
        description: 'Every batch is hand-inspected by our expert team for colour, aroma, and flavour profile before it ever leaves the garden.',
    },
    {
        Icon: Sparkles,
        title: 'Naturally Processed',
        description: 'Zero artificial additives or preservatives. Our cinnamon is simply harvested, sun-dried, and gently milled — nothing more.',
    },
    {
        Icon: Award,
        title: 'Premium Quality',
        description: 'Meeting international food safety standards for export to the EU, USA, Japan, and beyond, certified by Sri Lankan authorities.',
    },
    {
        Icon: Recycle,
        title: 'Sustainable Sourcing',
        description: 'We partner with farms that follow sustainable and ethical practices protecting Sri Lanka\'s cinnamon biodiversity for generations to come.',
    },
    {
        Icon: Package,
        title: 'Carefully Packaged',
        description: 'Sealed in premium, oxygen-free packaging to preserve freshness from the tropical gardens of Sri Lanka to your kitchen shelf.',
    },
];

const WhyCeylon = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-20 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <p className="text-cinnamon-600 text-sm font-semibold uppercase tracking-widest mb-3">
                        Our Promise
                    </p>
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold text-cinnamon-900 mb-4">
                        Why Ceylon Cinnamon?
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
                        Not all cinnamon is equal. True Ceylon cinnamon stands apart in flavour, purity, and heritage — and our dedication ensures you receive nothing less.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map(({ Icon, title, description }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 * i }}
                            className="group p-6 rounded-2xl border border-cream-200 hover:border-cinnamon-200 hover:shadow-card transition-all duration-300 bg-white hover:bg-cinnamon-50/30"
                        >
                            <div className="w-12 h-12 bg-cinnamon-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-cinnamon-200 transition-colors">
                                <Icon className="w-6 h-6 text-cinnamon-700" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-cinnamon-900 mb-3 group-hover:text-cinnamon-700 transition-colors">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyCeylon;
