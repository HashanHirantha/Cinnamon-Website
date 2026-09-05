import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { IMAGES } from '../data/images';

const stats = [
    { value: '100%', label: 'Ceylon Origin' },
    { value: 'A+', label: 'Premium Grade' },
    { value: '100%', label: 'Naturally Grown' },
    { value: '2000+', label: 'Years of Heritage' },
];

const CinnamonStory = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: '-100px' });

    return (
        <section ref={ref} className="py-20 lg:py-32 bg-cream-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image side */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-premium">
                            <img
                                src={IMAGES.story_farm}
                                alt="Ceylon cinnamon farm in Sri Lanka"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cinnamon-900/60 to-transparent" />
                            {/* Floating card */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-glass">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-cinnamon-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">🌿</div>
                                    <div>
                                        <p className="font-serif font-bold text-cinnamon-900 text-base">Certified Authentic</p>
                                        <p className="text-xs text-gray-500">Cinnamomum verum — True Ceylon Cinnamon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-cinnamon-100 rounded-full -z-10 opacity-60" />
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold-300/30 rounded-full -z-10" />
                    </motion.div>

                    {/* Text side */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <p className="text-cinnamon-600 text-sm font-semibold uppercase tracking-widest mb-4">
                            Our Heritage
                        </p>
                        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-cinnamon-900 leading-tight mb-6">
                            The Story Behind
                            <span className="text-cinnamon-600"> Ceylon Cinnamon</span>
                        </h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
                            <p>
                                For over two millennia, the coastal regions of Sri Lanka — then known as Ceylon — have been the world's foremost source of the most prized cinnamon. Unlike the common cassia variety found in most supermarkets,{' '}
                                <strong className="text-cinnamon-800">True Ceylon Cinnamon</strong> (
                                <em>Cinnamomum verum</em>) is known for its delicately sweet, complex flavour and paper-thin layers of bark.
                            </p>
                            <p>
                                At PURE GOLD Products, we work directly with generations of skilled cinnamon peelers — known as <strong className="text-cinnamon-800">chalias</strong> — in the gardens of Galle, Matara, and Kurunegala. Their hands still shape each quill with the same techniques passed down through centuries.
                            </p>
                            <p>
                                From cultivation under the dappled shade of Sri Lanka's tropical forests to careful sun-drying and hand-sorting, every step honours the land and the craft.
                            </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map(({ value, label }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                    className="bg-white border border-cream-200 rounded-2xl p-4 shadow-card"
                                >
                                    <p className="font-serif text-2xl font-bold text-cinnamon-700">{value}</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CinnamonStory;
