import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, ShoppingCart, Truck, Shield, RotateCcw, Star, ChevronRight, Minus, Plus, ZoomIn
} from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from '../components/Toast';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { reviews } from '../data/reviews';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const product = products.find((p) => p.slug === slug);
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [zoomed, setZoomed] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4">404</div>
                <h2 className="font-serif text-2xl font-bold text-cinnamon-900 mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-6">This product doesn't exist or has been removed.</p>
                <Link to="/shop" className="bg-cinnamon-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-cinnamon-700 transition-colors">
                    Back to Shop
                </Link>
            </div>
        );
    }

    const imageList = product.images || [product.image];
    const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    const wishlisted = isWishlisted(product.id);
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addToCart(product);
        toast.success(`${quantity}× "${product.name}" added to cart`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const tabs = ['description', 'details', 'shipping', 'reviews'];

    return (
        <div className="min-h-screen bg-cream-50 pt-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-cream-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Link to="/" className="hover:text-cinnamon-700 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to="/shop" className="hover:text-cinnamon-700 transition-colors">Shop</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* === LEFT: Image Gallery === */}
                    <div className="space-y-4">
                        {/* Main image */}
                        <div
                            className="relative rounded-3xl overflow-hidden aspect-square bg-cream-100 shadow-premium cursor-zoom-in"
                            onClick={() => setZoomed(!zoomed)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    src={imageList[selectedImage]}
                                    alt={product.name}
                                    className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}
                                />
                            </AnimatePresence>
                            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow">
                                <ZoomIn className="w-4 h-4 text-gray-600" />
                            </div>
                            {product.badge && (
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 text-xs font-semibold bg-cinnamon-600 text-white rounded-full shadow">
                                        {product.badge}
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {imageList.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {imageList.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-cinnamon-600 shadow-md' : 'border-cream-200 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* === RIGHT: Details === */}
                    <div className="space-y-6">
                        {/* Category */}
                        <p className="text-xs font-semibold text-cinnamon-600 uppercase tracking-widest capitalize">
                            {product.category}
                        </p>

                        {/* Name */}
                        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-cinnamon-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <StarRating rating={product.rating} size="md" />
                            <span className="text-sm text-cinnamon-700 font-semibold">{product.rating}</span>
                            <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-cinnamon-700">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                            {discount && (
                                <span className="px-2.5 py-1 bg-forest-100 text-forest-700 text-sm font-bold rounded-full">
                                    Save {discount}%
                                </span>
                            )}
                        </div>

                        {/* Short description */}
                        <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>

                        {/* Stock badge */}
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm text-gray-600">
                                {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center border border-cream-300 rounded-xl overflow-hidden bg-white">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-11 h-11 flex items-center justify-center text-cinnamon-700 hover:bg-cream-100 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-11 text-center text-sm font-semibold text-cinnamon-900 border-x border-cream-200">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-11 h-11 flex items-center justify-center text-cinnamon-700 hover:bg-cream-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="flex-1 flex items-center justify-center gap-2 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-premium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={!product.inStock}
                                className="flex-1 flex items-center justify-center gap-2 bg-cinnamon-900 hover:bg-cinnamon-800 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={() => {
                                    toggleWishlist(product);
                                    toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                                }}
                                className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all ${wishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-cream-300 text-gray-500 hover:border-cinnamon-300 hover:text-cinnamon-600'}`}
                            >
                                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Trust features */}
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-cream-200">
                            {[
                                { Icon: Truck, label: 'Free Shipping', sub: 'Orders over $50' },
                                { Icon: Shield, label: 'Authenticated', sub: 'Certified Ceylon' },
                                { Icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
                            ].map(({ Icon, label, sub }) => (
                                <div key={label} className="flex flex-col items-center gap-1 text-center p-3 bg-cream-50 rounded-xl">
                                    <Icon className="w-5 h-5 text-cinnamon-600 mb-1" />
                                    <p className="text-xs font-semibold text-gray-700">{label}</p>
                                    <p className="text-xs text-gray-400">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* === Tabs === */}
                <div className="mt-16">
                    <div className="flex gap-1 bg-cream-100 rounded-2xl p-1 w-fit mb-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap ${activeTab === tab ? 'bg-white text-cinnamon-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-card">
                        {activeTab === 'description' && (
                            <div className="prose prose-neutral max-w-none">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                            </div>
                        )}
                        {activeTab === 'details' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    ['Origin', product.origin],
                                    ['Weight', product.weight],
                                    ['Ingredients', product.ingredients],
                                    ['Processing', product.processing],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex gap-3 p-4 bg-cream-50 rounded-xl">
                                        <span className="text-sm font-semibold text-gray-700 min-w-[100px]">{label}:</span>
                                        <span className="text-sm text-gray-600">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'shipping' && (
                            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                <p>{product.shipping}</p>
                                <ul className="space-y-2">
                                    {[
                                        'Standard International: 7-14 business days',
                                        'Express International: 3-5 business days',
                                        'Free shipping on orders over $50',
                                        'All orders tracked and insured',
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-cinnamon-400 rounded-full flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="space-y-5">
                                {reviews.slice(0, 4).map((review) => (
                                    <div key={review.id} className="flex gap-4 p-4 border border-cream-100 rounded-xl">
                                        <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{review.name}</p>
                                                    <p className="text-xs text-gray-400">{review.country} · {review.date}</p>
                                                </div>
                                                <StarRating rating={review.rating} size="sm" />
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div className="mt-16">
                        <h2 className="font-serif text-2xl font-bold text-cinnamon-900 mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
