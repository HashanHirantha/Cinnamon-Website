import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IMAGES } from '../data/images';

const steps = [
    { emoji: '🌱', title: 'Sri Lankan Soil', description: 'Grown in the enriched tropical soils of the Southern Province — warm rains, coastal breezes, and generations of knowledge.' },
    { emoji: '🌿', title: 'Cinnamon Cultivation', description: 'Managed sustainably, the cinnamon trees grow for 2 years before first harvest. Shade intercropping protects biodiversity.' },
    { emoji: '✂️', title: 'Careful Harvesting', description: 'Skilled chalias cut shoots at the right moment — too early or too late and the magic is lost. Pure craft and instinct.' },
    { emoji: '🔧', title: 'Traditional Processing', description: 'The inner bark is carefully stripped and rolled into thin, tight quills by hand — an art unchanged for centuries.' },
    { emoji: '📦', title: 'Premium Packaging', description: 'Sorted, graded, and sealed in premium oxygen-free packaging to preserve full aroma and freshness for your journey.' },
    { emoji: '🏡', title: 'Your Home', description: 'From Sri Lanka\'s gardens to your kitchen — with every sprinkle, taste the warmth of the island.' },
];

const CinnamonJourney = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: '-80px' });

    return (
        <section
            ref={ref}
            className="py-20 lg:py-32 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #3f1c0c 0%, #5e2c14 40%, #2d6a2d 100%)',
            }}
        >
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                <img
                    src={IMAGES.journey_bg}
                    alt="Cinnamon journey"
                    className="w-full h-full object-cover opacity-20"
                    loading="lazy"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">
                        From Garden to Table
                    </p>
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white">
                        The Cinnamon Journey
                    </h2>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line on desktop */}
                    <div className="hidden lg:block absolute top-10 left-[8.33%] right-[8.33%] h-0.5 bg-white/20" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
                        {steps.map(({ emoji, title, description }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.15 * i }}
                                className="flex flex-col items-center text-center"
                            >
                                {/* Node */}
                                <div className="relative mb-5">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center text-3xl shadow-lg">
                                        {emoji}
                                    </div>
                                    {/* Step number */}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cinnamon-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {i + 1}
                                    </div>
                                </div>

                                {/* Arrow for mobile/tablet */}
                                {i < steps.length - 1 && (
                                    <div className="lg:hidden text-white/40 text-2xl my-2">↓</div>
                                )}

                                <h3 className="font-serif text-sm font-bold text-white mb-2">{title}</h3>
                                <p className="text-cream-100/60 text-xs leading-relaxed">{description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CinnamonJourney;
