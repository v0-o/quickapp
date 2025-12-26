import { useState, useRef, useEffect } from 'react';
import { useHaptic } from '../hooks/useHaptic.js';
import NameEditor from './NameEditor.jsx';
import ThemeSelector from './ThemeSelector.jsx';
import ProductsEditor from './ProductsEditor.jsx';
import DeliveryEditor from './DeliveryEditor.jsx';
import ContactEditor from './ContactEditor.jsx';
import BrandIcon from './icons/BrandIcon.jsx';
import ThemeIcon from './icons/ThemeIcon.jsx';
import ProductIcon from './icons/ProductIcon.jsx';
import DeliveryIcon from './icons/DeliveryIcon.jsx';
import ContactIcon from './icons/ContactIcon.jsx';

export default function ConfigPanel() {
  const [activeView, setActiveView] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const { medium } = useHaptic();
  const contentRef = useRef(null);

  const buttons = [
    { id: 'brand', label: 'Brand', Icon: BrandIcon },
    { id: 'themes', label: 'Themes', Icon: ThemeIcon },
    { id: 'products', label: 'Products', Icon: ProductIcon },
    { id: 'delivery', label: 'Delivery', Icon: DeliveryIcon },
    { id: 'contact', label: 'Contact', Icon: ContactIcon },
  ];

  const toggleView = (viewId) => {
    medium();
    if (activeView === viewId) {
      // Close with animation
      setIsClosing(true);
      setTimeout(() => {
        setActiveView(null);
        setIsClosing(false);
      }, 300);
    } else {
      setActiveView(viewId);
      setIsClosing(false);
    }
  };

  const closePanel = () => {
    medium();
    setIsClosing(true);
    setTimeout(() => {
      setActiveView(null);
      setIsClosing(false);
    }, 300);
  };

  // Get content height for smooth animation
  const getContentHeight = () => {
    switch(activeView) {
      case 'brand': return 280;
      case 'themes': return 350;
      case 'products': return 400;
      case 'delivery': return 320;
      case 'contact': return 380;
      default: return 300;
    }
  };

  const contentHeight = getContentHeight();

  return (
    <>
      {/* Backdrop - appears when panel content is open */}
      {activeView && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={closePanel}
        />
      )}

      {/* Sliding Content Panel - slides up from behind the button bar */}
      <div
        className={`fixed left-0 right-0 z-40 transition-transform duration-300 ease-out ${
          activeView && !isClosing ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          height: `${contentHeight}px`,
          maxHeight: '60vh',
        }}
      >
        <div className="h-full bg-[#1c1c1e] rounded-t-[20px] border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-white/30 rounded-full" />
          </div>
          
          {/* Content */}
          <div 
            ref={contentRef}
            className="h-full overflow-y-auto px-4 pb-4 custom-scrollbar"
            style={{ maxHeight: `${contentHeight - 40}px` }}
          >
            {activeView === 'brand' && <NameEditor />}
            {activeView === 'themes' && <ThemeSelector />}
            {activeView === 'products' && <ProductsEditor />}
            {activeView === 'delivery' && <DeliveryEditor />}
            {activeView === 'contact' && <ContactEditor />}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button Bar - ALWAYS stays at bottom, never moves */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="bg-black rounded-t-[20px] border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-around px-2 py-3">
            {buttons.map((button) => {
              const Icon = button.Icon;
              const isActive = activeView === button.id && !isClosing;
              return (
                <button
                  key={button.id}
                  onClick={() => toggleView(button.id)}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[56px] touch-manipulation ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/50 active:scale-95 hover:text-white/70 active:bg-white/5'
                  }`}
                  aria-label={button.label}
                  aria-pressed={isActive}
                >
                  <Icon 
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110' : ''
                    }`}
                    active={isActive}
                  />
                  <span className={`text-[9px] font-medium transition-all duration-200 ${
                    isActive ? 'font-semibold' : ''
                  }`}>
                    {button.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
