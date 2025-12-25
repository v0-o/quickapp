import { useEffect, useRef, useState } from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';
import { trackEvent } from '../utils/analytics.js';

const SearchBarComponent = ({ onSearch, searchQuery, onQueryChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
    trackEvent('search_performed', { query: searchQuery });
  };

  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    inputEl.addEventListener('focus', handleFocus);
    inputEl.addEventListener('blur', handleBlur);

    return () => {
      inputEl.removeEventListener('focus', handleFocus);
      inputEl.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto mb-6">
      <div
        className={`glass rounded-2xl p-3 flex items-center gap-3 transition-all ${
          isFocused ? 'ring-2 ring-emerald-400' : ''
        }`}
      >
        <span className="text-2xl">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Rechercher un produit..."
          className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              onQueryChange('');
              onSearch('');
            }}
            className="text-white/60 hover:text-white transition-all"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="cta-primary text-white px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
};

export const SearchBar = registerTangerineComponent('SearchBar', SearchBarComponent);

export default SearchBar;
