import { useConfigStore } from '../store/configStore.js';
import { useRef, useState } from 'react';
import { useHaptic } from '../hooks/useHaptic.js';

export default function NameEditor() {
  const { config, updateBrand } = useConfigStore();
  const { success, light } = useHaptic();
  const fileInputRef = useRef(null);
  const [logoUploaded, setLogoUploaded] = useState(false);

  if (!config?.brand) return null;

  const handleNameChange = (e) => {
    updateBrand({ name: e.target.value });
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBrand({ logo: reader.result });
      setLogoUploaded(true);
      success();
      setTimeout(() => setLogoUploaded(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    light();
    updateBrand({ logo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">
          Nom de la boutique
        </label>
        <input
          type="text"
          value={config.brand.name || ''}
          onChange={handleNameChange}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
          placeholder="My Shop"
        />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">
          Logo de la boutique
        </label>
        
        {config.brand.logo ? (
          <div className="space-y-2">
            <div className={`relative w-full h-20 bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 ${
              logoUploaded ? 'ring-2 ring-green-500/50 scale-105' : ''
            }`}>
              <img
                src={config.brand.logo}
                alt="Logo"
                className="w-full h-full object-contain p-2"
              />
              {logoUploaded && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 checkmark-animated">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-xs transition-colors"
              >
                Changer le logo
              </button>
              <button
                onClick={handleRemoveLogo}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-xs transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">📷</div>
              <div className="text-white/60 text-xs">Cliquez pour ajouter un logo</div>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}

