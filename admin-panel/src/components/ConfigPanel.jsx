import { useState } from 'react';
import NameEditor from './NameEditor.jsx';
import ThemeSelector from './ThemeSelector.jsx';
import CategoriesEditor from './CategoriesEditor.jsx';
import ProductsEditor from './ProductsEditor.jsx';
import DeliveryEditor from './DeliveryEditor.jsx';
import ContactEditor from './ContactEditor.jsx';

export default function ConfigPanel() {
  const [activeView, setActiveView] = useState(null);

  const buttons = [
    { id: 'brand', icon: '🏷️', label: 'Brand' },
    { id: 'themes', icon: '🎨', label: 'Themes' },
    { id: 'categories', icon: '📁', label: 'Categories' },
    { id: 'products', icon: '🛍️', label: 'Products' },
    { id: 'delivery', icon: '🚚', label: 'Delivery' },
    { id: 'contact', icon: '📞', label: 'Contact' },
  ];

  const toggleView = (viewId) => {
    setActiveView(activeView === viewId ? null : viewId);
  };

  return (
    <div className="w-full bg-[#0a0a0a] border-t border-white/10 fixed bottom-0 left-0 right-0 z-50">
      {/* Bottom Button Bar */}
      <div className="flex items-center justify-around px-1 py-2.5 bg-[#0a0a0a] border-t border-white/5">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => toggleView(button.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[50px] ${
              activeView === button.id
                ? 'bg-white/15 text-white scale-105'
                : 'text-white/50 active:scale-95'
            }`}
          >
            <span className="text-lg">{button.icon}</span>
            <span className="text-[9px] font-medium">{button.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area - Slide UP from bottom */}
      <div 
        className={`absolute bottom-full left-0 right-0 bg-[#0a0a0a] border-t border-white/10 transition-all duration-300 ease-out overflow-hidden ${
          activeView !== null ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-3 pb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
          {activeView === 'brand' && <NameEditor />}
          {activeView === 'themes' && <ThemeSelector />}
          {activeView === 'categories' && <CategoriesEditor />}
          {activeView === 'products' && <ProductsEditor />}
          {activeView === 'delivery' && <DeliveryEditor />}
          {activeView === 'contact' && <ContactEditor />}
        </div>
      </div>
    </div>
  );
}
