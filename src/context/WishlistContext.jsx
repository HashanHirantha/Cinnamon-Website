import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext(null);

const wishlistReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_WISHLIST': {
            const exists = state.items.find(item => item.id === action.payload.id);
            return exists
                ? { ...state, items: state.items.filter(item => item.id !== action.payload.id) }
                : { ...state, items: [...state.items, action.payload] };
        }
        case 'REMOVE_FROM_WISHLIST':
            return { ...state, items: state.items.filter(item => item.id !== action.payload) };
        default:
            return state;
    }
};

const loadWishlistFromStorage = () => {
    try {
        const saved = localStorage.getItem('ceylone_wishlist');
        return saved ? JSON.parse(saved) : { items: [] };
    } catch {
        return { items: [] };
    }
};

export const WishlistProvider = ({ children }) => {
    const [state, dispatch] = useReducer(wishlistReducer, loadWishlistFromStorage());

    useEffect(() => {
        localStorage.setItem('ceylone_wishlist', JSON.stringify(state));
    }, [state]);

    const isWishlisted = (id) => state.items.some(item => item.id === id);
    const toggleWishlist = (product) => dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    const removeFromWishlist = (id) => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });

    return (
        <WishlistContext.Provider
            value={{ wishlist: state.items, isWishlisted, toggleWishlist, removeFromWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};

export default WishlistContext;
