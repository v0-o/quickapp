import { registerTangerineComponent } from '../../lib/registry.js';

const ThemeToggleComponent = ({ theme, onToggle, cartOpen = false }) => (
  <button
    onClick={onToggle}
    className={`theme-toggle text-white ${cartOpen ? 'cart-open' : ''}`}
    title={theme === 'dark' ? 'Mode jour' : 'Mode nuit'}
    aria-label={theme === 'dark' ? 'Passer au mode jour' : 'Passer au mode nuit'}
  >
    {theme === 'dark' ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )}
  </button>
);

export const ThemeToggle = registerTangerineComponent('ThemeToggle', ThemeToggleComponent);

export default ThemeToggle;
