import { Star } from 'lucide-react';

const StarRating = ({ rating, max = 5, size = 'sm', showCount, count }) => {
    const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    className={`${sizeClass} transition-colors ${i < Math.floor(rating)
                            ? 'fill-gold-400 text-gold-400'
                            : i < rating
                                ? 'fill-gold-200 text-gold-300'
                                : 'fill-gray-200 text-gray-300'
                        }`}
                />
            ))}
            {showCount && count !== undefined && (
                <span className="text-xs text-gray-500 ml-1">({count})</span>
            )}
        </div>
    );
};

export default StarRating;
