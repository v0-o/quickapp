const hasWindow = () => typeof window !== 'undefined';

const ensureMetricsStore = () => {
  if (!hasWindow()) return [];
  if (!window.__mediaMetrics) {
    window.__mediaMetrics = [];
  }
  return window.__mediaMetrics;
};

const UMAMI_WEBSITE_ID = '663204ad-b6ac-4abd-8f89-37e6f8c0ed5d';
const CLARITY_TAG_ID = 'ucgu0pjrv2';
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const SHOULD_REGISTER_SW = import.meta.env.PROD === true;

export const trackEvent = (eventName, eventData = {}) => {
  if (!hasWindow()) return;
  try {
    if (typeof window.umami !== 'undefined' && typeof window.umami.track === 'function') {
      window.umami.track(eventName, eventData);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventData);
    }
  } catch (error) {
    console.warn('trackEvent failed', error);
  }
};

export const logMediaMetric = (productId, mediaIndex, eventName) => {
  try {
    const metrics = ensureMetricsStore();
    const item = {
      productId,
      mediaIndex,
      eventName,
      ts: Date.now(),
      perf: hasWindow() && typeof performance !== 'undefined' ? performance.now() : 0,
    };
    metrics.push(item);

    if (hasWindow()) {
      try {
        window.localStorage.setItem(
          'tangerine_media_metrics',
          JSON.stringify(metrics.slice(-200)),
        );
      } catch (storageError) {
        /* ignore */
      }
      console.debug('mediaMetric', item);
    }
  } catch {
    // ignore
  }
};

export const downloadMediaMetrics = () => {
  if (!hasWindow()) return;
  try {
    const metrics = ensureMetricsStore();
    const data = JSON.stringify(metrics);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tangerine_media_metrics_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.warn('Failed to export media metrics', error);
  }
};

export const registerServiceWorker = () => {
  if (!hasWindow()) return;
  if (!SHOULD_REGISTER_SW) return;
  if (!('serviceWorker' in navigator)) return;
  try {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.info('ServiceWorker registered', reg.scope))
      .catch((err) => console.warn('SW register failed', err));
  } catch (error) {
    console.warn('SW registration exception', error);
  }
};

export const disableUmamiForOwner = (attempt = 0) => {
  if (!hasWindow()) return false;

  try {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser?.username && tgUser.username.toLowerCase() === 'tangerine_212') {
      window.localStorage?.setItem('umami.disabled', '1');
      return true;
    }
  } catch (error) {
    console.warn('Umami owner check failed', error);
  }

  if (attempt < 3) {
    window.setTimeout(() => disableUmamiForOwner(attempt + 1), 800);
  }

  return false;
};

const loadAnalyticsScripts = () => {
  if (!hasWindow()) return;

  if (!UMAMI_WEBSITE_ID && !CLARITY_TAG_ID && !GA_MEASUREMENT_ID) {
    return;
  }

  try {
    if (UMAMI_WEBSITE_ID) {
      const umami = document.createElement('script');
      umami.defer = true;
      umami.src = 'https://cloud.umami.is/script.js';
      umami.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
      document.head.appendChild(umami);
    }

    if (CLARITY_TAG_ID) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
        t = l.createElement(r);
        t.async = 1;
        t.src = `https://www.clarity.ms/tag/${i}`;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      }(window, document, 'clarity', 'script', CLARITY_TAG_ID));
    }

    if (GA_MEASUREMENT_ID) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID);
    }
  } catch (error) {
    console.warn('Failed to load analytics scripts', error);
  }
};

export const scheduleDeferredAnalyticsLoad = () => {
  if (!hasWindow()) return undefined;

  let timeoutId;
  let loadHandler;

  const handleLoad = () => {
    disableUmamiForOwner();
    timeoutId = window.setTimeout(loadAnalyticsScripts, 3000);
  };

  if (document.readyState === 'complete') {
    handleLoad();
  } else {
    loadHandler = () => {
      window.removeEventListener('load', loadHandler);
      handleLoad();
    };
    window.addEventListener('load', loadHandler);
  }

  return () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    if (loadHandler) {
      window.removeEventListener('load', loadHandler);
    }
  };
};

export const LOGO_URL = 'https://i.imgur.com/opUOZzu.jpeg';
