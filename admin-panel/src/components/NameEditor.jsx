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
        <label className="block text-xs text-white/60 mb-2 uppercase tracking-wide">
          Shop Name
        </label>
        <input
          type="text"
          value={config.brand.name || ''}
          onChange={handleNameChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
          placeholder="Enter your shop name"
          autoFocus
        />
      </div>
    </div>
  );
}

