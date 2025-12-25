import { useConfigStore } from '../store/configStore.js';
import { useState } from 'react';

export default function DeliveryEditor() {
  const { config, updateConfig } = useConfigStore();
  const [newCity, setNewCity] = useState({ name: '', price: '', emoji: '📍' });

  const cities = config?.delivery?.cities || {};

  const handleAddCity = () => {
    if (!newCity.name.trim() || !newCity.price) return;
    
    const cityId = newCity.name.toLowerCase().replace(/\s+/g, '-');
    
    updateConfig({
      delivery: {
        cities: {
          ...cities,
          [cityId]: {
            name: newCity.name,
            price: Number(newCity.price),
            emoji: newCity.emoji,
            estimatedDays: 1,
          },
        },
      },
    });

    setNewCity({ name: '', price: '', emoji: '📍' });
  };

  const handleDeleteCity = (cityId) => {
    const newCities = { ...cities };
    delete newCities[cityId];
    updateConfig({
      delivery: { cities: newCities },
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-white/60 mb-2 uppercase tracking-wide">
          Delivery Cities
        </label>
        
        {/* Existing cities */}
        <div className="space-y-2 mb-3">
          {Object.entries(cities).map(([id, city]) => (
            <div key={id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <span className="text-lg">{city.emoji}</span>
              <span className="flex-1 text-sm text-white">{city.name}</span>
              <span className="text-sm text-white/70">{city.price}€</span>
              <button
                onClick={() => handleDeleteCity(id)}
                className="px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Add new city */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCity.emoji}
            onChange={(e) => setNewCity({ ...newCity, emoji: e.target.value })}
            className="w-12 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center text-sm focus:outline-none focus:border-white/30"
            placeholder="📍"
            maxLength={2}
          />
          <input
            type="text"
            value={newCity.name}
            onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="City name"
          />
          <input
            type="number"
            value={newCity.price}
            onChange={(e) => setNewCity({ ...newCity, price: e.target.value })}
            className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="€"
          />
          <button
            onClick={handleAddCity}
            className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/15"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

