import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };
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

  // Persist cart to localStorage & sync to server if logged in
  useEffect(() => {
    localStorage.setItem('ceylone_cart', JSON.stringify(state));

    const token = localStorage.getItem('ceylone_token');
    if (token) {
      cartApi.syncCart(state.items).catch(() => {});
    }
  }, [state]);

  const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const increaseQuantity = (id) => dispatch({ type: 'INCREASE_QUANTITY', payload: id });
  const decreaseQuantity = (id) => dispatch({ type: 'DECREASE_QUANTITY', payload: id });
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    const token = localStorage.getItem('ceylone_token');
    if (token) {
      cartApi.clearCart().catch(() => {});
    }
  };

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
