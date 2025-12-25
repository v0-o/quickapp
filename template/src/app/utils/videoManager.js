import { retryWithBackoff } from './retry.js';

const hasWindow = () => typeof window !== 'undefined';

const CONNECTION_WEIGHT = {
  high: 1,
  medium: 0.7,
  low: 0.4,
};

const pickConnectionTier = () => {
  if (!hasWindow()) return 'high';
  try {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return 'high';
    if (connection.saveData) return 'low';
    const type = (connection.effectiveType || '').toLowerCase();
    if (type.includes('4g') || type.includes('wifi')) return 'high';
    if (type.includes('3g')) return 'medium';
    return 'low';
  } catch {
    return 'high';
  }
};

export const selectMediaSource = (sources = []) => {
  if (!Array.isArray(sources) || sources.length === 0) return null;
  const tier = pickConnectionTier();
  const weight = CONNECTION_WEIGHT[tier] || 1;
  const sorted = [...sources].sort((a, b) => (a.quality || 0) - (b.quality || 0));
  const targetIndex = Math.max(0, Math.min(sorted.length - 1, Math.round((sorted.length - 1) * weight)));
  return sorted[targetIndex]?.url || sorted[sorted.length - 1]?.url || null;
};

class VideoManager {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.loading = new Set();
    this.cache = new Map();
    this.queue = [];
    this.isIosTelegram = this.detectIosTelegram();
    this.connectionTier = pickConnectionTier();
  }

  detectIosTelegram() {
    if (!hasWindow()) return false;
    try {
      if (window.Telegram?.WebApp?.platform) {
        return window.Telegram.WebApp.platform.toLowerCase() === 'ios';
      }
    } catch {
      /* ignore */
    }
    try {
      return /iphone|ipad|ipod/i.test(window.navigator.userAgent || '');
    } catch {
      return false;
    }
  }

  async loadVideo(src, options = {}) {
    if (!hasWindow()) return null;

    if (this.cache.has(src)) {
      const cached = this.cache.get(src);
      if (cached.blob && !cached.error) {
        return cached.blob;
      }
    }

    if (this.loading.size >= this.maxConcurrent) {
      await new Promise((resolve) => this.queue.push(resolve));
    }

    this.loading.add(src);
    try {
      const objectUrl = await retryWithBackoff(
        async () => {
          const response = await fetch(src, options.fetchOptions);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
        {
          maxRetries: 3,
          initialDelay: 500,
          onRetry: (attempt, error) => {
            console.log(`Retrying video load (attempt ${attempt}/3):`, src, error.message);
          },
        }
      );
      this.cache.set(src, { blob: objectUrl, error: null });
      return objectUrl;
    } catch (error) {
      this.cache.set(src, { blob: null, error });
      throw error;
    } finally {
      this.loading.delete(src);
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next();
      }
    }
  }

  preloadVideo(src, options = {}) {
    if (this.cache.has(src)) return;
    this.loadVideo(src, options).catch(() => { });
  }

  async prepareVideo(videoElement, src, options = {}) {
    if (!videoElement) return;

    try {
      videoElement.playsInline = true;
      videoElement.muted = true;
      videoElement.defaultMuted = true;
      videoElement.setAttribute('playsinline', '');
      videoElement.setAttribute('muted', '');
      videoElement.setAttribute('webkit-playsinline', '');

      const targetSource = options.sources ? selectMediaSource(options.sources) : src;
      const finalSrc = targetSource || src;
      const useDirectSrc = options.forceDirectSrc || this.isIosTelegram;
      if (useDirectSrc) {
        videoElement.src = finalSrc;
      } else {
        const objectUrl = await this.loadVideo(finalSrc, options);
        videoElement.src = objectUrl;
      }

      return new Promise((resolve, reject) => {
        const cleanup = () => {
          videoElement.removeEventListener('loadeddata', onLoaded);
          videoElement.removeEventListener('error', onError);
        };

        const onLoaded = () => {
          cleanup();
          resolve();
        };

        const onError = (event) => {
          cleanup();
          reject(event?.error || new Error('video_load_error'));
        };

        try {
          videoElement.preload = 'auto';
          videoElement.currentTime = 0;
          videoElement.addEventListener('loadeddata', onLoaded, { once: true });
          videoElement.addEventListener('error', onError, { once: true });
          videoElement.load();
        } catch (error) {
          cleanup();
          reject(error);
        }
      });
    } catch (error) {
      console.warn('Video prepare failed:', error);
      throw error;
    }
  }
}

const globalVideoManager = hasWindow()
  ? (window.videoManager ||= new VideoManager(3))
  : new VideoManager(3);

export const getVideoManager = () => globalVideoManager;

export const getPreferredPreload = () => {
  if (!hasWindow()) return 'metadata';
  try {
    const nav = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (nav) {
      if (nav.saveData) return 'metadata';
      const type = (nav.effectiveType || '').toLowerCase();
      if (type.includes('4g') || type.includes('wifi')) return 'auto';
      return 'metadata';
    }
  } catch {
    /* ignore */
  }
  return 'metadata';
};

export default VideoManager;
