import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from './Toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [imgLoaded, setImgLoaded] = useState(false);
    const wishlisted = isWishlisted(product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast.success(`"${product.name}" added to cart`);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
        toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500"
        >
            <Link to={`/products/${product.slug}`}>
                {/* Image */}
                <div className="relative overflow-hidden aspect-square bg-cream-100">
                    {!imgLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-cream-300 animate-pulse" />
                    )}
                    <img
                        src={product.image}
                        alt={product.name}
                        onLoad={() => setImgLoaded(true)}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.badge && (
                            <span className="px-2.5 py-1 text-xs font-semibold bg-cinnamon-600 text-white rounded-full shadow">
                                {product.badge}
                            </span>
                        )}
                        {discount && (
                            <span className="px-2.5 py-1 text-xs font-semibold bg-forest-600 text-white rounded-full shadow">
                                -{discount}%
                            </span>
                        )}
                    </div>
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={handleWishlist}
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all ${wishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-gray-600 hover:text-red-500'}`}
                        >
                            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                        </motion.button>
                        <Link
                            to={`/products/${product.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Quick view"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:text-cinnamon-600 shadow-lg transition-all"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Details */}
                <div className="p-4">
                    <p className="text-xs text-cinnamon-500 font-medium uppercase tracking-wider mb-1 capitalize">
                        {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2 group-hover:text-cinnamon-700 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.shortDescription}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-gold-400 text-gold-400' : 'fill-gray-200 text-gray-300'}`}
                            />
                        ))}
                        <span className="text-xs text-gray-500 ml-0.5">({product.reviewCount})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-cinnamon-700">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ${product.originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Add to cart */}
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-cinnamon-600 text-white text-sm font-medium rounded-xl hover:bg-cinnamon-700 transition-all shadow hover:shadow-md"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </motion.button>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
