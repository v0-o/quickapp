import { useState } from 'react';
import NameEditor from './NameEditor.jsx';
import ThemeSelector from './ThemeSelector.jsx';
import ProductsEditor from './ProductsEditor.jsx';
import DeliveryEditor from './DeliveryEditor.jsx';
import ContactEditor from './ContactEditor.jsx';

export default function ConfigPanel() {
  const [activeView, setActiveView] = useState(null);

  // Reduced buttons: Brand, Themes, Products (with categories), Delivery, Contact
  const buttons = [
    { id: 'brand', icon: '🏷️', label: 'Brand' },
    { id: 'themes', icon: '🎨', label: 'Themes' },
    { id: 'products', icon: '🛍️', label: 'Products' },
    { id: 'delivery', icon: '🚚', label: 'Delivery' },
    { id: 'contact', icon: '📞', label: 'Contact' },
  ];

  const toggleView = (viewId) => {
    setActiveView(activeView === viewId ? null : viewId);
  };

  return (
    <>
      {/* Content Panel - Slides UP from bottom (above buttons) */}
      <div 
        className={`fixed bottom-[70px] left-0 right-0 bg-[#0a0a0a] border-t border-white/5 transition-all duration-300 ease-out overflow-hidden z-40 ${
          activeView !== null ? 'max-h-[calc(100vh-140px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        style={{
          boxShadow: activeView !== null ? '0 -10px 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="px-4 pt-3 pb-4 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
          {activeView === 'brand' && <NameEditor />}
          {activeView === 'themes' && <ThemeSelector />}
          {activeView === 'products' && <ProductsEditor />}
          {activeView === 'delivery' && <DeliveryEditor />}
          {activeView === 'contact' && <ContactEditor />}
        </div>
      </div>

      {/* Bottom Button Bar - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-[#0a0a0a] border-t border-white/5 z-50">
        <div className="flex items-center justify-around px-1 py-2.5">
          {buttons.map((button) => (
            <button
              key={button.id}
              onClick={() => toggleView(button.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[60px] ${
                activeView === button.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 active:scale-95 hover:text-white/60'
              }`}
            >
              <span className="text-lg">{button.icon}</span>
              <span className="text-[9px] font-medium">{button.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
