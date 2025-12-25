import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';
import {
  MIN_QUANTITY,
  PRICES,
  QUANTITY_OPTIONS,
} from '../constants/index.js';
import {
  logMediaMetric,
  trackEvent,
} from '../utils/analytics.js';
import {
  getPreferredPreload,
  getVideoManager,
} from '../utils/videoManager.js';

const videoManager = getVideoManager();

const ProductDetailModalComponent = ({ product, onClose, onAddToCart, onAnimateAdd, openViewer }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(MIN_QUANTITY);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const videoRef = useRef(null);
  const isAccessory = product?.category === 'accessoires';

  useEffect(() => {
    if (!product) return undefined;

    trackEvent('product_detail_opened', { product: product.name });
    setSelectedMediaIndex(0);
    setMediaLoaded(false);

    const src = product.media?.[0];
    if (src && /\.(mp4|webm|ogg)(\?.*)?$/i.test(src) && videoRef.current) {
      videoManager
        .prepareVideo(videoRef.current, src)
        .then(() => {
          setMediaLoaded(true);
          logMediaMetric(product.id || product.name || 'unknown', 0, 'detail_load_success');
        })
        .catch((error) => {
          logMediaMetric(
            product.id || product.name || 'unknown',
            0,
            'detail_load_error',
            { error: error.message },
          );
        });
    }

    return () => {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          videoRef.current.src = '';
          videoRef.current.load();
        } catch (error) {
          /* ignore */
        }
      }
    };
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const src = product.media?.[selectedMediaIndex];
    setMediaLoaded(false);
    if (!src) return;

    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(src)) {
      if (videoRef.current) {
        videoManager
          .prepareVideo(videoRef.current, src)
          .then(() => {
            logMediaMetric(
              product.id || product.name || 'unknown',
              selectedMediaIndex,
              'detail_swap_success',
            );
            setMediaLoaded(true);
          })
          .catch(() => {
            // leave spinner visible
          });
      }
    } else {
      setMediaLoaded(true);
    }
  }, [product, selectedMediaIndex]);

  const handleAddToCart = useCallback((e) => {
    if (!product) return;
    // For packs, always add 1 unit. For other products, use selectedQuantity.
    const quantityToAdd = product.isPack ? 1 : selectedQuantity;
    const priceToAdd = product.isPack ? (product.price || 0) : ((PRICES[product.category] || 0) * quantityToAdd);

    onAddToCart(product, quantityToAdd, priceToAdd);

    if (onAnimateAdd && e?.currentTarget) {
      onAnimateAdd(product, quantityToAdd, e.currentTarget);
    }

    trackEvent('add_to_cart_from_detail', {
      product: product.name,
      quantity: quantityToAdd,
      price: priceToAdd,
    });
    onClose();
  }, [onAddToCart, onAnimateAdd, onClose, product, selectedQuantity]);

  const handleQuantityInput = (event) => {
    const value = event.target.value;
    // Allow empty string for typing
    if (value === '') {
      setSelectedQuantity('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!Number.isNaN(numValue)) {
      // Validation: Ensure quantity is within bounds (0 to 1000)
      // We allow 0 temporarily for typing, but min is enforced on blur/submit
      setSelectedQuantity(Math.min(1000, Math.max(0, numValue)));
    }
  };

  const price = useMemo(() => {
    const qty = selectedQuantity === '' ? 0 : selectedQuantity;
    return product ? (PRICES[product.category] || 0) * Math.max(MIN_QUANTITY, qty) : 0;
  }, [product, selectedQuantity]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      {/* Premium Integrated Close Button - Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed right-6 top-6 z-[60] group"
        aria-label="Fermer"
      >
        <div className="relative">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Main button container */}
          <div className="relative px-4 py-3 rounded-2xl glass backdrop-blur-2xl border border-white/10 shadow-2xl group-hover:border-orange-400/40 group-hover:bg-gradient-to-br group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300 active:scale-95">
            <div className="flex items-center gap-2">
              {/* Animated chevron icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>

              {/* Text label */}
              <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors duration-300 tracking-wide">
                RETOUR
              </span>
            </div>
          </div>
        </div>
      </button>

      <div
        className="glass-dark rounded-3xl max-w-2xl w-full max-h-[95vh] min-h-[85vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative">
          <div
            onClick={() => openViewer && openViewer(product, selectedMediaIndex)}
            className={`cursor-zoom-in relative w-full ${product.catalogOnly ? 'h-96' : 'h-72'} rounded-t-3xl overflow-hidden`}
            role="button"
            tabIndex={0}
          >
            {product.media?.[selectedMediaIndex] && /\.(mp4|webm|ogg)(\?.*)?$/i.test(product.media[selectedMediaIndex]) ? (
              <>
                {!mediaLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                    <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full spinner" />
                  </div>
                )}
                <video
                  key={`main-${product.id}-${selectedMediaIndex}`}
                  ref={videoRef}
                  className={`relative w-full ${product.catalogOnly ? 'h-96' : 'h-72'} object-cover video-smooth`}
                  loop
                  muted
                  playsInline
                  autoPlay
                  poster={(product.posters && product.posters[selectedMediaIndex]) || product.thumbnail}
                  fetchpriority="high"
                  preload="auto"
                  onLoadedMetadata={() => {
                    if (!videoRef.current) return;
                    videoRef.current.muted = true;
                    videoRef.current.defaultMuted = true;
                    videoRef.current.playsInline = true;
                    videoRef.current.setAttribute('playsinline', '');
                    videoRef.current.setAttribute('muted', '');
                    videoRef.current
                      .play()
                      .then(() => {
                        setMediaLoaded(true);
                        logMediaMetric(
                          product.id || product.name || 'unknown',
                          selectedMediaIndex,
                          'detail_autoplay_success',
                        );
                      })
                      .catch((error) => {
                        logMediaMetric(
                          product.id || product.name || 'unknown',
                          selectedMediaIndex,
                          'detail_autoplay_failed',
                          { error: error.message },
                        );
                        setTimeout(() => {
                          videoRef.current?.play().catch(() => { });
                        }, 500);
                      });
                  }}
                />
              </>
            ) : (
              <img
                src={product.thumbnail}
                alt={product.name}
                loading="lazy"
                className={`w-full ${product.catalogOnly ? 'h-96' : 'h-72'} object-cover`}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />


            <div className="absolute bottom-4 left-6">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{product.emoji}</span>
                <h2 id="product-detail-title" className="text-3xl font-black text-white">{product.name}</h2>
              </div>
            </div>
          </div>

          <div
            className="p-4 flex gap-3 overflow-x-auto hide-scrollbar"
            role="listbox"
            aria-label="Sélecteur de médias"
          >
            {product.media?.map((mediaSrc, idx) => (
              <button
                key={`${mediaSrc}-${idx}`}
                onClick={() => {
                  setSelectedMediaIndex(idx);
                  setMediaLoaded(false);
                }}
                className={`rounded-xl overflow-hidden border-2 ${selectedMediaIndex === idx
                  ? 'border-emerald-400 ring-2 ring-emerald-300/50'
                  : 'border-white/10 hover:border-white/30'
                  } p-0 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300/50`}
                style={{ minWidth: 96, minHeight: 64 }}
                title={`Ouvrir média ${idx + 1}`}
                role="option"
                aria-selected={selectedMediaIndex === idx}
                tabIndex={0}
              >
                {/\.(mp4|webm|ogg)(\?.*)?$/i.test(mediaSrc) ? (
                  <video
                    src={mediaSrc}
                    className="w-24 h-16 object-cover video-smooth"
                    muted
                    defaultMuted
                    preload={getPreferredPreload()}
                    playsInline
                    fetchpriority="high"
                    poster={(product.posters && product.posters[idx]) || product.thumbnail}
                    onPlay={(event) => {
                      try {
                        event.target.muted = true;
                        event.target.defaultMuted = true;
                        event.target.volume = 0;
                      } catch (error) {
                        /* ignore */
                      }
                    }}
                    onLoadedMetadata={(event) => {
                      try {
                        const video = event.target;
                        video.muted = true;
                        video.defaultMuted = true;
                        video.volume = 0;
                        const width = video.videoWidth || 0;
                        const height = video.videoHeight || 0;
                        if (height > width) video.classList.add('is-portrait');
                        else video.classList.remove('is-portrait');
                      } catch (error) {
                        /* ignore */
                      }
                    }}
                  />
                ) : (
                  <img src={mediaSrc} className="w-24 h-16 object-cover" loading="lazy" alt="aperçu média" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {product.isPack && product.details ? (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-xl mb-3">📦 Contenu du Pack</h3>
              <div className="glass p-4 rounded-2xl space-y-3">
                {product.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xl">✨</span>
                    <span className="text-white font-semibold text-base">{detail}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm italic px-2">{product.desc}</p>

              {product.originalPrice && (
                <div className="glass p-3 rounded-xl flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    <p className="text-white/60 text-sm">Prix Spécial</p>
                    <div className="flex items-center gap-2">
                      <span className="line-through text-white/50 text-sm decoration-red-500/50">{product.originalPrice}€</span>
                      <span className="gradient-text font-bold text-xl">{product.price}€</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs px-2 py-1 rounded-lg text-white bg-red-500/80 animate-pulse">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-white font-bold text-xl mb-3">📝 Description</h3>
              <p className="text-white/90 leading-relaxed text-base">{product.desc}</p>
            </div>
          )}

          {isAccessory && !product.catalogOnly ? (
            <div className="space-y-4">
              <div className="glass p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Prix indicatif</p>
                  <p className="text-white/80 font-semibold text-lg">À définir</p>
                </div>
              </div>
            </div>
          ) : product.isPack ? (
            <button
              onClick={handleAddToCart}
              className="w-full glass-cta font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mt-4"
            >
              <span>🛒</span>
              <div className="flex items-center gap-2">
                <span>Ajouter au panier</span>
                {product.originalPrice && (
                  <span className="line-through opacity-60 text-sm decoration-red-500/50">{product.originalPrice}€</span>
                )}
                <span>({product.price}€)</span>
              </div>
            </button>
          ) : !product.catalogOnly ? (
            <>
              <div className="glass p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-white/60 text-xs">Prix unitaire</p>
                  <p className="gradient-text font-bold text-lg">{PRICES[product.category] || 0}€/g</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold text-base mb-2">⚖️ Quantité (min. {MIN_QUANTITY}g)</h3>

                <div className="flex gap-3">
                  <input
                    type="number"
                    min={MIN_QUANTITY}
                    value={selectedQuantity}
                    onChange={handleQuantityInput}
                    onBlur={() => {
                      if (selectedQuantity === '' || selectedQuantity < MIN_QUANTITY) {
                        setSelectedQuantity(MIN_QUANTITY);
                      }
                    }}
                    className="w-full glass text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 text-center font-bold text-lg"
                    placeholder={`Min. ${MIN_QUANTITY}g`}
                  />
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full glass-cta font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <span>🛒</span>
                <span>Ajouter ({price}€)</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const ProductDetailModal = registerTangerineComponent(
  'ProductDetailModal',
  ProductDetailModalComponent,
);

export default ProductDetailModal;
