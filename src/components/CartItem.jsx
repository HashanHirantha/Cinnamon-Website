import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';

const CartItem = ({ item }) => {
    const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-start gap-4 py-5 border-b border-cream-200 last:border-0"
        >
            {/* Image */}
            <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-cream-200"
                    loading="lazy"
                />
            </Link>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <Link
                    to={`/products/${item.slug}`}
                    className="text-sm font-semibold text-gray-900 hover:text-cinnamon-700 transition-colors line-clamp-2 leading-snug"
                >
                    {item.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">{item.weight}</p>
                <div className="flex items-center gap-3 flex-wrap">
                    <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => increaseQuantity(item.id)}
                        onDecrease={() => decreaseQuantity(item.id)}
                    />
                    <span className="text-sm font-bold text-cinnamon-700">
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Remove */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
                <Trash2 className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
};

export default CartItem;
