import { create } from 'zustand';
import { StorageManager } from '../app/utils/storage.js';

export const useCartStore = create((set, get) => ({
  cart: [],
  isCartOpen: false,

  setCart: async (newCart) => {
    set({ cart: newCart });
    await StorageManager.saveCart(newCart);
  },

  addToCart: async (product, quantity, price) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let newCart;

    if (existingIndex !== -1) {
      newCart = cart.map((item, index) => {
        if (index === existingIndex) {
          return { ...item, quantity: item.quantity + quantity, totalPrice: item.totalPrice + price };
        }
        return item;
      });
    } else {
      newCart = [...cart, { product, quantity, totalPrice: price }];
    }

    await set({ cart: newCart });
    await StorageManager.saveCart(newCart);
  },

  removeFromCart: async (index) => {
    const { cart } = get();
    const newCart = cart.filter((_, idx) => idx !== index);
    set({ cart: newCart });
    await StorageManager.saveCart(newCart);
  },

  updateQuantity: async (index, newQuantity, newPrice) => {
    const { cart } = get();
    const newCart = cart.map((item, idx) =>
      idx === index ? { ...item, quantity: newQuantity, totalPrice: newPrice } : item
    );
    set({ cart: newCart });
    await StorageManager.saveCart(newCart);
  },

  clearCart: async () => {
    set({ cart: [] });
    await StorageManager.saveCart([]);
  },

  toggleCartOpen: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
}));
