import { useState } from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';

const PAYMENT_OPTIONS = [
  { key: 'cash', label: 'Espèces', icon: '💵', gradient: 'from-green-500 to-emerald-500' },
  { key: 'crypto', label: 'Crypto', icon: '🪙', gradient: 'from-purple-500 to-blue-500' },
];

const CRYPTO_METHODS = [
  { label: 'Solana', icon: '◎', gradient: 'from-purple-500 to-blue-500' },
  { label: 'Bitcoin', icon: '₿', gradient: 'from-orange-500 to-amber-500' },
  { label: 'USDT', icon: '₮', gradient: 'from-emerald-500 to-green-500' },
  { label: 'Ethereum', icon: 'Ξ', gradient: 'from-blue-500 to-cyan-500' },
];

const PaymentMethodSelectorComponent = ({ selectedMethod, onMethodChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">💳</span>
          <h3 className="text-white font-bold">Mode de paiement</h3>
        </div>
        <span className={`text-white/60 text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_OPTIONS.map(({ key, label, icon, gradient }) => {
              const isSelected = selectedMethod === key;
              return (
                <button
                  key={key}
                  onClick={() => onMethodChange(key)}
                  className={`${isSelected
                    ? `bg-gradient-to-r ${gradient} scale-105 glow`
                    : 'glass hover:bg-white/10'
                    } text-white font-semibold py-4 px-3 rounded-xl transition-all text-sm active:scale-95`}
                >
                  <div className="text-2xl mb-1">{icon}</div>
                  <div>{label}</div>
                </button>
              );
            })}
          </div>

          {selectedMethod === 'crypto' && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {CRYPTO_METHODS.map(({ label, icon, gradient }) => (
                <div key={label} className="glass-dark rounded-lg p-3 flex items-center gap-3">
                  <div className={`w-9 h-9 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-base`}>
                    {icon}
                  </div>
                  <span className="text-white/80 text-sm font-semibold">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PaymentMethodSelector = registerTangerineComponent(
  'PaymentMethodSelector',
  PaymentMethodSelectorComponent,
);

export default PaymentMethodSelector;
