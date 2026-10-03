import { motion } from 'framer-motion';
import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-card flex flex-col gap-4 border border-cream-200 hover:shadow-card-hover transition-shadow duration-300"
        >
            {/* Stars */}
            <StarRating rating={review.rating} size="md" />

            {/* Review text */}
            <div>
                <p className="font-serif text-sm font-semibold text-cinnamon-800 mb-2">"{review.title}"</p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{review.text}</p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2 border-t border-cream-100">
                <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-cream-200"
                    loading="lazy"
                />
                <div>
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.country}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewCard;
