import { createContext, useContext, useReducer, useCallback, useMemo } from "react";

const CartContext = createContext(null);

// ═══════════════════════════════════════════
// REDUCER - Manages cart state with actions
// ═══════════════════════════════════════════
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cartItems.find(i => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          cartItems: state.cartItems.map(i =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(i => i.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      if (action.payload.quantity < 1) return state;
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
      };

    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };

    case "SET_TOAST_EXITING":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.payload ? { ...t, exiting: true } : t
        ),
      };

    default:
      return state;
  }
};

const initialState = {
  cartItems: [],
  toasts: [],
};

// ═══════════════════════════════════════════
// PROVIDER - Wraps app and provides context
// ═══════════════════════════════════════════
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Toast notification handler
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: "SET_TOAST_EXITING", payload: id });
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", payload: id });
      }, 350);
    }, 2500);
  }, []);

  // Action: Add product to cart
  const addToCart = useCallback((product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    addToast(`${product.name} added to cart`);
  }, [addToast]);

  // Action: Remove product from cart
  const removeFromCart = useCallback((id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  }, []);

  // Action: Update product quantity
  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  // Action: Clear entire cart
  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  // ═══════════════════════════════════════════
  // MEMOIZED CALCULATIONS (useMemo optimization)
  // ═══════════════════════════════════════════
  
  // Total number of items in cart
  const cartCount = useMemo(
    () => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [state.cartItems]
  );

  // Total price of all items
  const cartTotal = useMemo(
    () => state.cartItems.reduce((sum, item) => sum + item.rawPrice * item.quantity, 0),
    [state.cartItems]
  );

  // Cart analytics for dashboard
  const cartAnalytics = useMemo(() => {
    const totalItems = state.cartItems.length;
    const totalQuantity = cartCount;
    const avgItemPrice = totalItems > 0 ? cartTotal / totalQuantity : 0;
    const mostExpensiveItem = state.cartItems.reduce(
      (max, item) => (item.rawPrice > max.rawPrice ? item : max),
      state.cartItems[0] || { rawPrice: 0 }
    );

    return {
      totalItems,
      totalQuantity,
      totalValue: cartTotal,
      avgItemPrice,
      mostExpensiveItem,
    };
  }, [state.cartItems, cartCount, cartTotal]);

  // Context value
  const value = {
    cartItems: state.cartItems,
    toasts: state.toasts,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    cartAnalytics,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
