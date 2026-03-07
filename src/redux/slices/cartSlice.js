import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  toasts: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action 1: Add item to cart
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // Action 2: Remove item from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // Action 3: Update item quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },

    // Action 4: Clear entire cart
    clearCart: (state) => {
      state.items = [];
    },

    // Action 5: Add toast notification
    addToast: (state, action) => {
      state.toasts.push(action.payload);
    },

    // Action 6: Remove toast notification
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },

    // Action 7: Set toast exiting state
    setToastExiting: (state, action) => {
      const toast = state.toasts.find(t => t.id === action.payload);
      if (toast) {
        toast.exiting = true;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToast,
  removeToast,
  setToastExiting,
} = cartSlice.actions;

export default cartSlice.reducer;