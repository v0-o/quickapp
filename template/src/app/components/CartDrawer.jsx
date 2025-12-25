import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { registerTangerineComponent } from '../../lib/registry.js';
import {
  DELIVERY_PRICES,
  PROMO_CODES,
} from '../constants/index.js';
import { trackEvent } from '../utils/analytics.js';
import { PromoCodeInput } from './PromoCodeInput.jsx';
import { PaymentMethodSelector } from './PaymentMethodSelector.jsx';

const CartDrawerComponent = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  deliveryCity,
  onDeliveryCityChange,
  paymentMethod,
  onPaymentMethodChange,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.totalPrice, 0),
    [cart],
  );

  const deliveryPrice = DELIVERY_PRICES[deliveryCity]?.price || 0;
  const orderTotal = subtotal + deliveryPrice;

  const discount = useMemo(() => {
    if (appliedPromo && PROMO_CODES[appliedPromo]) {
      return Math.round(orderTotal * PROMO_CODES[appliedPromo].discount);
    }
    return 0;
  }, [appliedPromo, orderTotal]);

  // Simplified: removed weight/minimum logic - using simple unit pricing
  const total = orderTotal - discount;

  const handleQuantityChange = useCallback((index, delta) => {
    const item = cart[index];
    // Simple unit price - always use product.price
    const unitPrice = item.product.price || 0;
    const minQty = 1; // Minimum quantity is always 1
    // Validation: Ensure quantity is within bounds (1 to 1000)
    const newQuantity = Math.min(1000, Math.max(minQty, item.quantity + delta));

    onUpdateQuantity(index, newQuantity, unitPrice * newQuantity);
    trackEvent('cart_quantity_change', {
      product: item.product.name,
      newQuantity,
    });
  }, [cart, onUpdateQuantity]);

  const handleCheckout = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#fbbf24']
    });
    onCheckout();
  }, [onCheckout]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    if (isOpen) {
      trackEvent('cart_opened', { itemCount: cart.length });
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, cart.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass-dark shadow-2xl z-[60] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🛒</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">Panier</h2>
                  <p className="text-white/60 text-sm">{cart.length} article{cart.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="group relative z-50"
                aria-label="Fermer"
              >
                <div className="relative">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Main button container */}
                  <div className="relative px-4 py-3 rounded-2xl glass backdrop-blur-2xl border border-white/10 shadow-2xl group-hover:border-orange-400/40 group-hover:bg-gradient-to-br group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300 active:scale-95">
                    <div className="flex items-center gap-2">
                      {/* Animated chevron icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>

                      {/* Text label */}
                      <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors duration-300 tracking-wide">
                        RETOUR
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center mt-20 animate-fade-in-up">
                  <div className="text-7xl mb-4 float">🛒</div>
                  <p className="text-white/60 text-lg font-semibold mb-2">Panier vide</p>
                  <p className="text-white/40 text-sm mb-6">Ajoutez des produits</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all active:scale-95"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              ) : (
                <>
                  {cart.map((item, idx) => {
                    const unitPrice = item.product.price || 0;
                    const minQty = 1;

                    return (
                      <div
                        key={`${item.product.id}-${idx}`}
                        className="glass rounded-2xl p-4 animate-slide-in-right"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <div className="flex gap-3 mb-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-orange-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                            {item.product.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{item.product.name}</p>
                            <p className="text-emerald-300 text-xs font-bold">
                              {item.quantity} × {unitPrice}€
                            </p>
                            <p className="text-white/90 font-bold text-lg">{item.totalPrice}€</p>
                          </div>
                          <button
                            onClick={() => {
                              onRemoveItem(idx);
                              trackEvent('cart_item_removed', { product: item.product.name });
                            }}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 rounded-xl transition-all self-start active:scale-90"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(idx, -1)}
                            disabled={item.quantity <= minQty}
                            className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-all font-bold flex-1 active:scale-95"
                          >
                            -1
                          </button>
                          <div className="flex-1 text-center">
                            <span className="text-white font-bold text-lg">
                              {item.quantity}
                            </span>
                          </div>
                          <button
                            onClick={() => handleQuantityChange(idx, 1)}
                            className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-all font-bold flex-1 active:scale-95"
                          >
                            +1
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <PromoCodeInput
                    appliedPromo={appliedPromo}
                    onApplyPromo={onApplyPromo}
                    onRemovePromo={onRemovePromo}
                  />

                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onMethodChange={onPaymentMethodChange}
                  />

                  <div className="glass rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🚚</span>
                      <h3 className="text-white font-bold">Livraison</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(DELIVERY_PRICES).map(([key, info]) => (
                        <button
                          key={key}
                          onClick={() => {
                            onDeliveryCityChange(key);
                            trackEvent('delivery_city_changed', { city: info.name });
                          }}
                          className={`${deliveryCity === key
                            ? 'cta-primary scale-105 glow'
                            : 'glass hover:bg-white/10'
                            } text-white font-semibold py-3 px-2 rounded-xl transition-all text-sm relative active:scale-95`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>{info.emoji}</span>
                            <span>{info.name}</span>
                          </div>
                          <div className={`text-xs mt-1 ${info.price === 0 ? 'text-green-300 font-bold' : 'opacity-80'}`}>
                            {info.price === 0 ? 'GRATUIT' : `${info.price}€`}
                          </div>
                          {info.featured && (
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                              ⭐
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4 bg-black/30">
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Sous-total:</span>
                    <span className="font-bold">{subtotal}€</span>
                  </div>
                  {discount > 0 && (
                    <>
                      <div className="flex justify-between text-green-400 text-sm">
                        <span>🎟️ Réduction:</span>
                        <span className="font-bold">-{discount}€</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
                        <span>💚</span>
                        <span>Vous avez économisé {discount}€ !</span>
                      </div>
                    </>
                  )}
                  {deliveryPrice > 0 ? (
                    <>
                      <div className="flex justify-between text-white/80 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{DELIVERY_PRICES[deliveryCity]?.emoji || '🚚'}</span>
                          <span>Livraison:</span>
                        </div>
                        <span className="font-bold">{deliveryPrice}€</span>
                      </div>
                      <div className="text-white/60 text-xs">
                        ⏱️ Livraison estimée: {DELIVERY_PRICES[deliveryCity]?.estimatedDays || 0} jour{(DELIVERY_PRICES[deliveryCity]?.estimatedDays || 0) > 1 ? 's' : ''}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <span>🎉</span>
                        <span className="font-semibold">Livraison gratuite !</span>
                      </div>
                      <div className="text-white/60 text-xs">
                        ⏱️ Livraison estimée: {DELIVERY_PRICES[deliveryCity]?.estimatedDays || 0} jour{(DELIVERY_PRICES[deliveryCity]?.estimatedDays || 0) > 1 ? 's' : ''}
                      </div>
                    </>
                  )}
                  <div className="border-t border-white/20 pt-2 flex justify-between">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="gradient-text font-black text-3xl">{total}€</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full font-bold py-4 rounded-2xl transition-all bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 hover:from-orange-600 hover:via-pink-600 hover:to-orange-600 text-white hover:scale-105 active:scale-95 glow"
                >
                  🚀 Commander
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const CartDrawer = registerTangerineComponent('CartDrawer', CartDrawerComponent);

export default CartDrawer;
