import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ quantity, onIncrease, onDecrease, min = 1, max = 99 }) => {
    return (
        <div className="flex items-center border border-cream-300 rounded-xl overflow-hidden bg-white">
            <button
                type="button"
                onClick={onDecrease}
                disabled={quantity <= min}
                aria-label="Decrease quantity"
                className="w-10 h-10 flex items-center justify-center text-cinnamon-700 hover:bg-cream-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-cinnamon-900 border-x border-cream-300">
                {quantity}
            </span>
            <button
                type="button"
                onClick={onIncrease}
                disabled={quantity >= max}
                aria-label="Increase quantity"
                className="w-10 h-10 flex items-center justify-center text-cinnamon-700 hover:bg-cream-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
};

export default QuantitySelector;
