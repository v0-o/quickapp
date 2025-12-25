import { useCallback } from 'react';
import { useCartStore } from '../store/cartStore.js';
import { useUIStore } from '../store/uiStore.js';
import { useHaptic } from './useHaptic.js';
import { MIN_QUANTITY, PRICES } from '../app/constants/index.js';

export const useCartLogic = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { showNotification } = useUIStore();
  const { medium, success, error } = useHaptic();

  const handleAddToCart = useCallback(
    async (product, quantity, price) => {
      // Bypass minimum quantity for packs and accessories
      if (!product.isPack && product.category !== 'accessoires' && quantity < MIN_QUANTITY) {
        showNotification(`Minimum ${MIN_QUANTITY}g par produit`, 'error');
        error();
        return;
      }

      try {
        await addToCart(product, quantity, price);
        success();
      } catch {
        error();
        showNotification('Erreur lors de l\'ajout', 'error');
      }
    },
    [addToCart, showNotification, success, error]
  );

  const handleRemoveFromCart = useCallback(
    async (index) => {
      try {
        await removeFromCart(index);
        medium();
        showNotification('Produit retiré', 'info');
      } catch {
        error();
        showNotification('Erreur lors de la suppression', 'error');
      }
    },
    [removeFromCart, showNotification, medium, error]
  );

  const handleUpdateQuantity = useCallback(
    async (index, newQuantity, newPrice) => {
      try {
        await updateQuantity(index, newQuantity, newPrice);
        medium();
      } catch {
        error();
        showNotification('Erreur lors de la mise à jour', 'error');
      }
    },
    [updateQuantity, showNotification, medium, error]
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    cart,
    cartTotal,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    clearCart,
  };
};
