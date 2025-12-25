import { useEffect, useRef } from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';
import {
  DELIVERY_PRICES,
  PRICES,
} from '../constants/index.js';

const ConfirmationModalComponent = ({
  isOpen,
  onConfirm,
  onCancel,
  cart,
  deliveryCity,
  total,
  paymentMethod,
  discount,
  subtotal,
  deliveryPrice,
}) => {
  const dialogRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const focusables = () => {
      if (!dialogRef.current) return [];
      return Array.from(dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => !el.hasAttribute('disabled'));
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const node = dialogRef.current;
    node?.addEventListener('keydown', onKeyDown);
    (confirmRef.current || node)?.focus();
    return () => node?.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate pricing values
  const calculatedSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryInfo = DELIVERY_PRICES[deliveryCity];
  const calculatedDeliveryPrice = deliveryInfo?.price || 0;

  // Use passed values or calculated ones
  const finalSubtotal = subtotal !== undefined ? subtotal : calculatedSubtotal;
  const finalDeliveryPrice = deliveryPrice !== undefined ? deliveryPrice : calculatedDeliveryPrice;
  const finalDiscount = discount || 0;
  const finalTotal = total !== undefined ? total : (finalSubtotal + finalDeliveryPrice - finalDiscount);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="glass-dark rounded-3xl max-w-md w-full animate-zoom-in max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
        ref={dialogRef}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">✅</span>
            <h3 id="confirm-title" className="text-2xl font-bold text-white">Confirmer</h3>
          </div>
          <p className="text-white/60 text-sm">Vérifiez avant de valider</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            {cart.map((item, index) => (
              <div key={index} className="glass rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{item.product.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{item.product.name}</p>
                  <p className="text-white/60 text-xs">
                    {item.quantity}g × {PRICES[item.product.category] || 0}€
                  </p>
                </div>
                <span className="text-orange-400 font-bold text-sm">{item.totalPrice}€</span>
              </div>
            ))}
          </div>

          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-white/80 text-sm">
              <span>Sous-total:</span>
              <span className="font-bold">{finalSubtotal}€</span>
            </div>
            {finalDiscount > 0 && (
              <>
                <div className="flex justify-between text-green-400 text-sm">
                  <span>🎟️ Réduction:</span>
                  <span className="font-bold">-{finalDiscount}€</span>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
                  <span>💚</span>
                  <span>Vous avez économisé {finalDiscount}€ !</span>
                </div>
              </>
            )}
            {finalDeliveryPrice > 0 ? (
              <>
                <div className="flex justify-between text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{deliveryInfo.emoji}</span>
                    <span>Livraison:</span>
                  </div>
                  <span className="font-bold">{finalDeliveryPrice}€</span>
                </div>
                <div className="text-white/60 text-xs">
                  ⏱️ Livraison estimée: {deliveryInfo.estimatedDays} jour{deliveryInfo.estimatedDays > 1 ? 's' : ''}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <span>🎉</span>
                  <span className="font-semibold">Livraison gratuite à {deliveryInfo.name} !</span>
                </div>
                <div className="text-white/60 text-xs">
                  ⏱️ Livraison estimée: {deliveryInfo.estimatedDays} jour{deliveryInfo.estimatedDays > 1 ? 's' : ''}
                </div>
              </>
            )}
            <div className="flex justify-between text-white/80 text-sm pt-2 border-t border-white/20">
              <span>Paiement:</span>
              <span className="font-bold">
                {paymentMethod === 'cash' ? '💵 Espèces' : '🪙 Crypto'}
              </span>
            </div>
            <div className="border-t border-white/20 pt-2 flex justify-between">
              <span className="text-white font-bold">Total:</span>
              <span className="gradient-text font-black text-2xl">{finalTotal}€</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 glass hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 hover:from-orange-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95 glow"
            ref={confirmRef}
          >
            ✅ Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConfirmationModal = registerTangerineComponent(
  'ConfirmationModal',
  ConfirmationModalComponent,
);

export default ConfirmationModal;
