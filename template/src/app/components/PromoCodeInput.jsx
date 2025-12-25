import { useState } from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';
import { PROMO_CODES } from '../constants/index.js';
import { trackEvent } from '../utils/analytics.js';

const PromoCodeInputComponent = ({ appliedPromo, onApplyPromo, onRemovePromo }) => {
  const [promoInput, setPromoInput] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    const upperCode = promoInput.toUpperCase().trim();
    if (PROMO_CODES[upperCode]) {
      onApplyPromo(upperCode);
      setError('');
      trackEvent('promo_code_applied', { code: upperCode });
    } else {
      setError('Code invalide');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden animate-slide-up">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🎟️</span>
          <h3 className="text-white font-bold">Code promo</h3>
        </div>
        <span className={`text-white/60 text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 space-y-3">
          {appliedPromo ? (
            <div className="glass-dark rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{appliedPromo}</p>
                  <p className="text-green-400 text-xs font-semibold">{PROMO_CODES[appliedPromo].label} appliqué</p>
                </div>
              </div>
              <button
                onClick={onRemovePromo}
                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-2 rounded-lg transition-all active:scale-90 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value)}
                onKeyPress={(event) => event.key === 'Enter' && handleApply()}
                placeholder="Entrez votre code"
                className="w-full glass text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 placeholder-white/40 uppercase"
              />
              {error && (
                <p className="text-red-400 text-xs font-semibold animate-fade-in-up">{error}</p>
              )}
              <button
                onClick={handleApply}
                className="w-full cta-primary font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                Appliquer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PromoCodeInput = registerTangerineComponent('PromoCodeInput', PromoCodeInputComponent);

export default PromoCodeInput;
