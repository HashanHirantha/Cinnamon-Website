import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer shadow-card"
        >
            <Link to={`/shop?category=${category.slug}`} aria-label={category.name}>
                {/* Background image */}
                <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cinnamon-900/90 via-cinnamon-900/40 to-transparent group-hover:from-cinnamon-900/95 transition-all duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-cinnamon-300 text-xs font-medium uppercase tracking-widest mb-1">
                        {category.count} Products
                    </p>
                    <h3 className="text-white font-serif text-xl font-bold leading-tight mb-2">
                        {category.name}
                    </h3>
                    <p className="text-cream-200/80 text-sm leading-snug line-clamp-2 mb-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-gold-400 text-sm font-medium">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CategoryCard;
