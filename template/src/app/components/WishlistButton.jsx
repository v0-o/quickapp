import { registerTangerineComponent } from '../../lib/registry.js';

const WishlistButtonComponent = ({ product, isInWishlist, onToggle }) => (
  <button
    onClick={(event) => {
      event.stopPropagation();
      onToggle(product);
    }}
    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 ${
      isInWishlist ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-black/50 hover:bg-black/70 text-white/80'
    } backdrop-blur-sm active:scale-90`}
    title={isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
  >
    <span className="text-xl">{isInWishlist ? '❤️' : '🤍'}</span>
  </button>
);

export const WishlistButton = registerTangerineComponent(
  'WishlistButton',
  WishlistButtonComponent,
);

export default WishlistButton;
