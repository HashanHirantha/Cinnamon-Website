import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
    const { cart, cartTotal, clearCart } = useCart();

    const shipping = cartTotal >= 50 ? 0 : 8.99;
    const grandTotal = cartTotal + shipping;

    return (
        <div className="min-h-screen bg-cream-50 pt-20">
            {/* Page header */}
            <div className="bg-cinnamon-900 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-serif text-3xl font-bold text-white">Shopping Cart</h1>
                    <div className="flex items-center gap-2 mt-2 text-xs text-cream-200/50">
                        <Link to="/" className="hover:text-cream-200 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-cream-200">Cart</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {cart.length === 0 ? (
                    /* Empty cart */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-12 h-12 text-cinnamon-300" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-cinnamon-900 mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">Explore our premium Ceylon cinnamon collection and add your favourites.</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-premium"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-serif text-xl font-bold text-cinnamon-900">
                                        Cart Items ({cart.length})
                                    </h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <CartItem key={item.id} item={item} />
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="mt-4">
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center gap-2 text-sm text-cinnamon-700 hover:text-cinnamon-900 font-medium transition-colors"
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl shadow-card p-6">
                                <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-5">Order Summary</h2>
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                                            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs text-gray-400">
                                            Add ${(50 - cartTotal).toFixed(2)} more for free shipping
                                        </p>
                                    )}
                                    <div className="border-t border-cream-200 pt-3 flex justify-between font-bold text-cinnamon-900">
                                        <span>Total</span>
                                        <span className="text-lg">${grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link
                                    to="/checkout"
                                    className="w-full flex items-center justify-center gap-2 bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-premium hover:shadow-lg"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>

                            {/* Trust */}
                            <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5">
                                <div className="space-y-2">
                                    {['🔒 Secure checkout', '🚚 Fast shipping worldwide', '✅ 30-day returns', '🌿 100% authentic Ceylon'].map((item) => (
                                        <p key={item} className="text-xs text-gray-600 flex items-center gap-2">{item}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
