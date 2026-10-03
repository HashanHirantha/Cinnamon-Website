import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { cartApi, getGuestId } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload || [] };
    case 'ADD_TO_CART': {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'INCREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    case 'DECREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('ceylone_cart');
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, loadCartFromStorage());
  const { user } = useAuth();
  const initialLoadDone = useRef(false);
  const prevUserRef = useRef(user?.id);

  // 1. Initial cart sync from database on mount
  useEffect(() => {
    const initServerCart = async () => {
      try {
        const guestId = getGuestId();
        const res = await cartApi.getCart(guestId);
        if (res.success && res.data) {
          const serverItems = Array.isArray(res.data) ? res.data : res.data.items || [];
          if (serverItems.length > 0 && state.items.length === 0) {
            dispatch({ type: 'SET_CART', payload: serverItems });
          } else if (state.items.length > 0) {
            // Push current local items to database bucket
            await cartApi.syncCart(state.items, guestId);
          }
        }
      } catch (err) {
        console.warn('Initial cart fetch from server skipped or offline:', err.message);
      } finally {
        initialLoadDone.current = true;
      }
    };

    initServerCart();
  }, []);

  // 2. Handle user login: Merge guest cart into user cart in database
  useEffect(() => {
    const handleAuthChange = async () => {
      const currentUserId = user?.id;
      if (currentUserId && currentUserId !== prevUserRef.current) {
        try {
          const guestId = getGuestId();
          const mergeRes = await cartApi.mergeCart(guestId);
          if (mergeRes.success && mergeRes.data?.items) {
            dispatch({ type: 'SET_CART', payload: mergeRes.data.items });
          } else {
            // Otherwise fetch the user's saved cart from database
            const userCartRes = await cartApi.getCart();
            if (userCartRes.success && userCartRes.data) {
              const items = Array.isArray(userCartRes.data) ? userCartRes.data : userCartRes.data.items || [];
              if (items.length > 0) {
                dispatch({ type: 'SET_CART', payload: items });
              }
            }
          }
        } catch (err) {
          console.warn('Cart merge on login failed:', err.message);
        }
      }
      prevUserRef.current = currentUserId;
    };

    handleAuthChange();
  }, [user]);

  // 3. Persist cart to localStorage & save to database 'carts' bucket on every update
  useEffect(() => {
    localStorage.setItem('ceylone_cart', JSON.stringify(state));

    const syncToDatabase = async () => {
      try {
        const guestId = getGuestId();
        await cartApi.syncCart(state.items, guestId);
      } catch (err) {
        // Silent catch for offline development or temporary network hiccups
      }
    };

    syncToDatabase();
  }, [state]);

  const cartTotal = state.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const cartCount = state.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  const addToCart = useCallback((product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, []);

  const increaseQuantity = useCallback((id) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: id });
  }, []);

  const decreaseQuantity = useCallback((id) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    try {
      const guestId = getGuestId();
      cartApi.clearCart(guestId).catch(() => {});
    } catch {
      // Ignore
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
