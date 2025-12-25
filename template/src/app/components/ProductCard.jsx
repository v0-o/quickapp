import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import { registerTangerineComponent } from '../../lib/registry.js';
import {
  PRICES,
  QUANTITY_OPTIONS,
} from '../constants/index.js';
import {
  logMediaMetric,
  trackEvent,
} from '../utils/analytics.js';
import { WishlistButton } from './WishlistButton.jsx';

const ProductCardComponent = memo(({
  product,
  onAddToCart,
  onAnimateAdd,
  onViewDetails,
  isInWishlist,
  onToggleWishlist,
  isInitiallyVisible = false,
  isPriority = false,
  style,
  className,
}) => {
  const [videoState, setVideoState] = useState('thumbnail');
  const [isVisible, setIsVisible] = useState(isInitiallyVisible);
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const observerRef = useRef(null);
  const productKey = useMemo(
    () => product.id || product.name || 'unknown',
    [product.id, product.name],
  );
  const isAccessory = product.category === 'accessoires';
  const imageLoading = isPriority ? 'eager' : 'lazy';
  const imageFetchPriority = isPriority ? 'high' : 'auto';
  const videoPreload = isPriority ? 'auto' : 'metadata';
  const videoFetchPriority = isPriority ? 'high' : 'low';
  const isLoadedRef = useRef(false);

  const forcePlay = useCallback((reason, retryCount = 0) => {
    const video = videoRef.current;
    if (!video || videoState === 'error') {
      return;
    }

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    video
      .play()
      .then(() => {
        // Si la lecture démarre, on considère la vidéo comme chargée
        setVideoState((prev) => (prev === 'error' ? prev : 'loaded'));
        logMediaMetric(productKey, 0, `play_success_${reason}`);
      })
      .catch(() => {
        logMediaMetric(productKey, 0, `play_error_${reason}`);
        if (retryCount < 5 && (isVisible || isInitiallyVisible)) {
          const delay = 200 * (retryCount + 1);
          setTimeout(() => forcePlay(reason, retryCount + 1), delay);
        }
      });
  }, [isInitiallyVisible, isVisible, productKey, videoState]);

  useEffect(() => {
    // Préparation immédiate de la vidéo comme dans la version legacy
    if (!videoRef.current || !product.media?.[0] || isLoadedRef.current) {
      return () => { };
    }

    isLoadedRef.current = true;
    setVideoState('loading');

    try {
      videoRef.current.src = product.media[0];
      logMediaMetric(productKey, 0, 'card_src_assigned');
    } catch (error) {
      logMediaMetric(productKey, 0, `direct_src_error_${error?.message || 'unknown'}`);
      setVideoState('error');
    }

    trackEvent('product_view', {
      product: product.name,
      category: product.category,
    });

    return () => { };
  }, [product.category, product.media, product.name, productKey]);

  useEffect(() => {
    try {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (!entry || !videoRef.current) return;

          setIsVisible(entry.isIntersecting);
          logMediaMetric(productKey, 0, entry.isIntersecting ? 'observer_enter' : 'observer_exit');

          if (entry.isIntersecting) {
            // Dès qu'une carte devient visible, on force la lecture comme dans le legacy
            forcePlay('observer');
          } else if (videoRef.current) {
            try {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            } catch {
              // ignore pause errors
            }
          }
        },
        {
          threshold: [0.5],
          rootMargin: '50px',
        },
      );
    } catch (error) {
      console.error('IntersectionObserver setup failed:', error);
    }

    if (cardRef.current && observerRef.current) {
      observerRef.current.observe(cardRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [forcePlay, product.category, product.media, product.name, productKey, videoState]);

  useEffect(() => {
    if (videoState === 'loaded' && (isInitiallyVisible || isVisible)) {
      forcePlay(isInitiallyVisible ? 'initial_loaded' : 'visible_loaded');
    }
  }, [forcePlay, isInitiallyVisible, isVisible, videoState]);

  useEffect(() => {
    if (isVisible) {
      forcePlay('visibility_change');
    }
  }, [forcePlay, isVisible]);

  const handleQuickAdd = useCallback((qty, event) => {
    event.stopPropagation();

    if (product.category === 'accessoires') {
      onViewDetails(product);
      trackEvent('accessory_open_details', { product: product.name });
      return;
    }

    const button = event.currentTarget;
    if (button) {
      button.classList.add('tap-state');
      setTimeout(() => button.classList.remove('tap-state'), 260);
    }

    const price = product.isPack ? (product.price || 0) * qty : (PRICES[product.category] || 0) * qty;
    onAddToCart(product, qty, price);
    if (onAnimateAdd && button) {
      onAnimateAdd(product, qty, button);
    }
    trackEvent('quick_add_to_cart', {
      product: product.name,
      quantity: qty,
      price,
    });
  }, [onAddToCart, onAnimateAdd, onViewDetails, product]);

  const handleAccessoryCTA = useCallback((event) => {
    event.stopPropagation();

    const button = event.currentTarget;
    if (button) {
      button.classList.add('tap-state');
      setTimeout(() => button.classList.remove('tap-state'), 260);
    }

    onViewDetails(product);
    trackEvent('accessory_open_details', { product: product.name });
  }, [onViewDetails, product]);

  const handleVideoLoad = useCallback(() => {
    setVideoState('loaded');
    logMediaMetric(productKey, 0, 'card_loadeddata');
  }, [productKey]);

  const handleVideoError = useCallback(() => {
    setVideoState('error');
    logMediaMetric(productKey, 0, 'card_error');
  }, [productKey]);

  return (
    <motion.div
      ref={cardRef}
      style={style}
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: 'spring', damping: 15, stiffness: 150, duration: 0.3 }}
      className={`snap-center flex-shrink-0 w-80 glass rounded-3xl card-hover relative overflow-hidden group h-[520px] flex flex-col ${videoState === 'loaded' && (isVisible || isInitiallyVisible) ? 'card-playing' : ''
        } ${className || ''}`}
    >
      <div className="card-halo" aria-hidden="true" />
      {onToggleWishlist && (
        <WishlistButton
          product={product}
          isInWishlist={isInWishlist}
          onToggle={onToggleWishlist}
        />
      )}
      <div
        onClick={() => {
          onViewDetails(product);
          trackEvent('product_detail_view', { product: product.name });
        }}
        className="relative flex-1 w-full overflow-hidden bg-black/30 cursor-pointer product-video-container"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => event.key === 'Enter' && onViewDetails(product)}
      >
        {product.badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className="product-badge">{product.badge}</span>
          </div>
        )}
        {/* AVIF & WebP Support */}
        <picture>
          {product.thumbnail.endsWith('.jpg') || product.thumbnail.endsWith('.png') ? (
            <>
              <source srcSet={product.thumbnail.replace(/\.(jpg|png)$/, '.avif')} type="image/avif" />
              <source srcSet={product.thumbnail.replace(/\.(jpg|png)$/, '.webp')} type="image/webp" />
            </>
          ) : null}
          <img
            src={product.thumbnail}
            loading={imageLoading}
            fetchpriority={imageFetchPriority}
            decoding="async"
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${videoState === 'loaded' ? 'opacity-0' : 'opacity-100'
              }`}
          />
        </picture>

        {product.media?.[0] && (
          <video
            ref={videoRef}
            data-product-id={product.id || product.name}
            src={product.media[0]}
            className="absolute inset-0 w-full h-full object-cover video-smooth"
            autoPlay
            loop
            muted
            playsInline
            preload={videoPreload}
            poster={(product.posters && product.posters[0]) || product.thumbnail}
            fetchpriority={videoFetchPriority}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
          />
        )}

        {videoState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full spinner" />
          </div>
        )}

        {videoState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-red-500/10 to-transparent z-10">
            <span className="text-4xl mb-2">⚠️</span>
            <p className="text-white/60 text-xs">Vidéo indisponible</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute bottom-3 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-semibold bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            👁️ Détails
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{product.emoji}</span>
          <h3 className="text-white font-bold text-lg flex-1 line-clamp-2 h-14 flex items-center">{product.name}</h3>
          {!product.catalogOnly && (
            <div className="flex gap-1.5">
              {(product.oldPrice || (product.isPack && product.originalPrice)) && (
                <span className="font-bold text-xs px-2 py-1 rounded-lg text-white bg-red-500/80 animate-pulse whitespace-nowrap">
                  📉 -{Math.round((((product.oldPrice || product.originalPrice) - (product.isPack ? (product.price || 0) : (PRICES[product.category] || 0))) / (product.oldPrice || product.originalPrice)) * 100)}%
                </span>
              )}
              <span
                className={`font-bold text-xs px-2 py-1 rounded-lg ${isAccessory
                  ? 'bg-white/10 text-white/80 border border-white/10'
                  : product.isPack
                    ? 'text-can-gold bg-can-gold/20 border border-can-gold/30'
                    : 'text-emerald-300 bg-emerald-500/20'
                  }`}
              >
                {isAccessory ? 'Prix à définir' : product.isPack ? (
                  product.originalPrice ? (
                    <span className="flex items-center gap-1">
                      <span className="line-through opacity-50 text-[10px] decoration-red-500/50">{product.originalPrice}€</span>
                      <span>{product.price}€</span>
                    </span>
                  ) : `${product.price}€`
                ) : (
                  product.oldPrice ? (
                    <span className="flex items-center gap-1">
                      <span className="line-through opacity-50 text-[10px] decoration-red-500/50">{product.oldPrice}€</span>
                      <span>{PRICES[product.category] || 0}€/g</span>
                    </span>
                  ) : `${PRICES[product.category] || 0}€/g`
                )}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {product.catalogOnly ? (
            <button
              onClick={handleAccessoryCTA}
              className="w-full glass-cta font-semibold h-[52px] rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>👁️</span>
              <span>Voir détails</span>
            </button>
          ) : isAccessory || product.isPack ? (
            <div className="flex gap-2 w-full">
              <button
                onClick={(e) => handleQuickAdd(1, e)}
                className="flex-1 glass-cta font-semibold h-[52px] rounded-xl text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <span>🛒</span>
                <span>Ajouter</span>
              </button>
              <button
                onClick={handleAccessoryCTA}
                className="flex-1 glass font-semibold h-[52px] rounded-xl text-sm flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-95 transition-transform"
              >
                <span>👁️</span>
                <span>Détails</span>
              </button>
            </div>
          ) : (
            QUANTITY_OPTIONS.map((qty) => (
              <button
                key={qty}
                onClick={(event) => handleQuickAdd(qty, event)}
                className="flex-1 quantity-button glass-cta font-semibold px-6 py-2.5 rounded-xl text-base leading-tight"
              >
                {qty}g
                <br />
                <span className="block text-xs opacity-90 mt-0.5">
                  {product.oldPrice && (
                    <span className="line-through text-white/50 mr-1 decoration-red-500/50">
                      {product.oldPrice * qty}€
                    </span>
                  )}
                  {(PRICES[product.category] || 0) * qty}€
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
});

export const ProductCard = registerTangerineComponent('ProductCard', ProductCardComponent);

export default ProductCard;
