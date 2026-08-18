import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-4 text-center pt-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-lg"
            >
                <div className="text-9xl mb-4 select-none">🪹</div>
                <h1 className="font-serif text-6xl font-bold text-cinnamon-900 mb-3">404</h1>
                <p className="font-serif text-2xl text-cinnamon-700 mb-4">Page Not Found</p>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    It seems this page has wandered off into the cinnamon gardens.
                    Let us guide you back to something wonderful.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="bg-cinnamon-600 hover:bg-cinnamon-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-premium"
                    >
                        Back to Home
                    </Link>
                    <Link
                        to="/shop"
                        className="border-2 border-cinnamon-200 text-cinnamon-700 hover:border-cinnamon-600 font-semibold px-8 py-4 rounded-2xl transition-all"
                    >
                        Browse Shop
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
