import { useMemo, useState } from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';

const clampNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.max(0, parsed);
};

const ensureRangeOrder = (range) => {
  if (range.min > range.max) {
    return { min: range.min, max: range.min };
  }
  return range;
};

const FilterSortBarComponent = ({
  sortBy = 'default',
  onSortChange,
  priceRange = { min: 0, max: 1000 },
  onPriceRangeChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (event) => {
    onSortChange?.(event.target.value);
  };

  const handlePriceInputChange = (key) => (event) => {
    if (!onPriceRangeChange) return;
    const fallback = key === 'min' ? 0 : 1000;
    const nextValue = clampNumber(event.target.value, fallback);
    const nextRange = ensureRangeOrder({ ...priceRange, [key]: nextValue });
    onPriceRangeChange(nextRange);
  };

  const normalizedRange = useMemo(
    () => ensureRangeOrder(priceRange || { min: 0, max: 1000 }),
    [priceRange],
  );

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex-shrink-0 glass hover:bg-white/10 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <span>🔽</span>
          <span>Filtres</span>
        </button>

        <select
          value={sortBy}
          onChange={handleSortChange}
          className="flex-shrink-0 glass text-white px-4 py-2 rounded-xl font-semibold text-sm outline-none focus:ring-2 focus:ring-emerald-400 bg-transparent"
        >
          <option value="default">Trier par</option>
          <option value="price-low">Prix: Croissant</option>
          <option value="price-high">Prix: Décroissant</option>
          <option value="name">Nom: A-Z</option>
        </select>
      </div>

      {showFilters && (
        <div className="glass rounded-2xl p-4 space-y-3 animate-slide-down">
          <div>
            <label className="text-white font-semibold text-sm mb-2 block" htmlFor="price-min">
              Prix (€)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="price-min"
                type="number"
                min="0"
                max="1000"
                value={normalizedRange.min}
                onChange={handlePriceInputChange('min')}
                className="flex-1 glass text-white px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-transparent"
                placeholder="Min"
              />
              <span className="text-white/60">-</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={normalizedRange.max}
                onChange={handlePriceInputChange('max')}
                className="flex-1 glass text-white px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-transparent"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FilterSortBar = registerTangerineComponent(
  'FilterSortBar',
  FilterSortBarComponent,
);

export default FilterSortBar;
