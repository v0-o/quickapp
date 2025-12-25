import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';
import {
  logMediaMetric,
} from '../utils/analytics.js';
import { getPreferredPreload } from '../utils/videoManager.js';

const FullscreenViewerComponent = ({ isOpen, product, startIndex = 0, onClose }) => {
  const [index, setIndex] = useState(startIndex || 0);
  const containerRef = useRef(null);
  const startX = useRef(0);
  const deltaX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragThreshold = 0.15;
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimerRef = useRef(null);

  const mediaCount = product?.media?.length || 0;

  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    setIsControlsVisible(true);
    controlsTimerRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    if (product) {
      setIndex(startIndex || 0);
    }
  }, [startIndex, product?.id]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (event) => {
      if (event.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, mediaCount - 1));
      if (event.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
      if (event.key === 'Escape') onClose?.();
      resetControlsTimer();
    };

    window.addEventListener('keydown', onKey);
    const timer = setTimeout(() => setIsControlsVisible(false), 2500);
    controlsTimerRef.current = timer;

    return () => {
      window.removeEventListener('keydown', onKey);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [isOpen, mediaCount, onClose, resetControlsTimer]);

  useEffect(() => {
    if (!product?.media) return;
    const neighbors = [index - 1, index + 1].filter((i) => i >= 0 && i < product.media.length);
    neighbors.forEach((i) => {
      const src = product.media[i];
      if (!src) return;
      if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(src)) {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto';
      } else {
        const img = new Image();
        img.src = src;
      }
    });
  }, [index, product]);

  if (!isOpen || !product) return null;

  const goNext = () => setIndex((i) => Math.min(i + 1, product.media.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleTouchStart = (event) => {
    setIsDragging(true);
    startX.current = event.touches[0].clientX;
    deltaX.current = 0;
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;
    deltaX.current = event.touches[0].clientX - startX.current;
    const containerWidth = containerRef.current?.clientWidth || 1;
    const offsetPercent = deltaX.current / containerWidth;

    const hasNext = index < product.media.length - 1;
    const hasPrev = index > 0;

    if ((!hasNext && offsetPercent < 0) || (!hasPrev && offsetPercent > 0)) {
      const resistance = 0.15;
      const resistedOffset = Math.sign(offsetPercent) * (Math.abs(offsetPercent) ** 3) * resistance;
      setDragOffset(resistedOffset);
    } else {
      setDragOffset(offsetPercent * 0.85);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) > dragThreshold) {
      if (dragOffset < 0) goNext();
      else goPrev();
    }

    setDragOffset(0);
    deltaX.current = 0;
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <div
        ref={containerRef}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-full h-full relative flex items-center justify-center"
      >
        <div className="fixed top-0 left-0 right-0 h-24 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
          <button
            onClick={(event) => {
              event.stopPropagation();
              onClose?.();
            }}
            className="absolute top-12 left-1/2 -translate-x-1/2 glass-dark hover:bg-white/10 text-white/90 hover:text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 backdrop-blur-lg border border-white/10 pointer-events-auto"
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-semibold tracking-wide">FERMER</span>
          </button>
        </div>

        {index > 0 && (
          <button
            onClick={() => goPrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/60 backdrop-blur text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95"
          >
            ◀
          </button>
        )}
        {index < product.media.length - 1 && (
          <button
            onClick={() => goNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/60 backdrop-blur text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95"
          >
            ▶
          </button>
        )}

        <div className="w-full overflow-hidden rounded-2xl">
          {product.media.map((mediaSrc, idx) => (
            <div
              key={`${mediaSrc}-${idx}`}
              style={{
                transform: `translateX(${100 * (idx - index) + (dragOffset * 100)}%)`,
                transition: isDragging ? 'none' : 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: Math.abs(idx - index) <= 1 ? 1 : 0,
                scale: isDragging ? '0.98' : '1',
                filter: isDragging ? 'brightness(0.9)' : 'brightness(1)',
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center touch-none select-none"
            >
              {/\.(mp4|webm|ogg)(\?.*)?$/i.test(mediaSrc) ? (
                <video
                  src={mediaSrc}
                  className="w-full max-h-[80vh] object-contain video-smooth"
                  autoPlay
                  muted
                  defaultMuted
                  controls
                  playsInline
                  preload={getPreferredPreload()}
                  fetchpriority={index === idx ? 'high' : 'low'}
                  onLoadedData={(event) => {
                    try {
                      event.target.muted = true;
                      event.target.defaultMuted = true;
                      event.target.volume = 0;
                      logMediaMetric(product.id || product.name || 'unknown', idx, 'viewer_loadeddata');
                    } catch {
                      /* ignore */
                    }
                  }}
                  onPlay={(event) => {
                    try {
                      event.target.muted = true;
                      event.target.volume = 0;
                    } catch (error) {
                      /* ignore */
                    }
                  }}
                />
              ) : (
                <img src={mediaSrc} loading="lazy" className="w-full max-h-[80vh] object-contain" alt="media" />
              )}
            </div>
          ))}
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 z-40 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
          <div className="relative p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              {product.media.map((_, idx) => (
                <button
                  key={`${product.id}-${idx}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === index ? 'bg-white scale-150' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  title={`Média ${idx + 1}`}
                />
              ))}
            </div>
            <div className="text-white/60 text-xs font-medium">
              {index + 1} / {product.media.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FullscreenViewer = registerTangerineComponent(
  'FullscreenViewer',
  FullscreenViewerComponent,
);

export default FullscreenViewer;
