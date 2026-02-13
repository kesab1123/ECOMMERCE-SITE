import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => t.id === id ? { ...t, exiting: true } : t)
      );
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
    }, 2500);
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        addToast(`${product.name} quantity updated`);
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      addToast(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [addToast]);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    if (qty < 1) return;
    setCartItems(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: qty } : i)
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.rawPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity,
      clearCart, cartCount, cartTotal, toasts
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};