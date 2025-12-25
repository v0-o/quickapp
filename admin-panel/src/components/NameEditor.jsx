import { useConfigStore } from '../store/configStore.js';

export default function NameEditor() {
  const { config, updateBrand } = useConfigStore();

  if (!config?.brand) return null;

  const handleNameChange = (e) => {
    updateBrand({ name: e.target.value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wide">
          Nom de la boutique
        </label>
        <input
          type="text"
          value={config.brand.name || ''}
          onChange={handleNameChange}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20 placeholder-white/30"
          placeholder="Nom de la boutique"
          autoFocus
        />
      </div>
    </div>
  );
}

