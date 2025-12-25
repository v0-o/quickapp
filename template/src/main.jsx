import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from "@sentry/react";
import './design/tokens.css';
import './index.css';
import App from './App.jsx';
import { setupHotReload } from './config/hotReload.js';

// Setup hot reload for admin panel
setupHotReload();

// Initialize Sentry for error monitoring
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled: import.meta.env.MODE === 'production' || import.meta.env.VITE_SENTRY_ENABLED === 'true',
});

// Prevent Web3 library conflicts
if (typeof window !== 'undefined' && !window.ethereum) {
  Object.defineProperty(window, 'ethereum', {
    value: undefined,
    writable: true,
    configurable: true,
  });
}

if (typeof window !== 'undefined' && !window.Telegram) {
  window.Telegram = {
    WebApp: {
      initData: '',
      initDataUnsafe: {
        query_id: '',
        user: { id: 0, first_name: 'Dev', is_bot: false },
        auth_date: Math.floor(Date.now() / 1000),
      },
      isExpanded: true,
      isFullscreen: false,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
      viewportStableHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
      headerColor: '#ffffff',
      backgroundColor: '#ffffff',
      bottomBarColor: '#ffffff',
      isClosingConfirmationEnabled: false,
      ready: () => {
        // Safe no-op for dev environment
      },
      expand: () => {
        // Safe no-op for dev environment
      },
      requestFullscreen: () => {
        // Safe no-op for dev environment
      },
      lockOrientation: () => {
        // Safe no-op for dev environment
      },
      addToHomeScreen: () => {
        // Safe no-op for dev environment
      },
      checkHomeScreenStatus: (cb) => {
        if (typeof cb === 'function') {
          cb('unknown');
        }
      },
      HapticFeedback: {
        impactOccurred: () => { },
        notificationOccurred: () => { },
        selectionChanged: () => { },
      },
      MainButton: {
        onClick: () => { },
        offClick: () => { },
        show: () => { },
        hide: () => { },
        enable: () => { },
        disable: () => { },
        setText: () => { },
        setParams: () => { },
      },
      BackButton: {
        onClick: () => { },
        offClick: () => { },
        show: () => { },
        hide: () => { },
      },
      onEvent: () => { },
      offEvent: () => { },
      safeAreaInset: { top: 0, bottom: 0, left: 0, right: 0 },
      contentSafeAreaInset: { top: 0, bottom: 0, left: 0, right: 0 },
      CloudStorage: {
        getItem: (key, callback) => callback(null, null),
        setItem: (key, value, callback) => callback(null),
        removeItem: (key, callback) => callback(null),
        getKeys: (callback) => callback(null, []),
      },
      sendData: () => { },
      close: () => { },
      openLink: (url) => {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      },
      openTelegramLink: (url) => {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      },
      openInvoice: () => { },
      showPopup: () => { },
      showAlert: (message) => {
        if (typeof window !== 'undefined') {
          alert(message);
        }
      },
      showConfirm: (message, callback) => {
        if (typeof window !== 'undefined' && typeof callback === 'function') {
          callback(confirm(message));
        }
      },
    },
  };
}

// Listen for messages from parent (admin panel) - MUST BE BEFORE createRoot
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    // Ensure message is from a trusted origin in production
    // if (event.origin !== "http://your-admin-panel-domain.com") return;

    if (event.data && event.data.type === 'CONFIG_UPDATE') {
      console.log('📥 Received config update from parent:', event.data.config);
      updateConfigAndTheme(event.data.config);
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to br, #05090b, #0b1411, #05090b)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Oups, un petit problème technique
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '400px' }}>
              L'application a rencontré une erreur : <br />
              <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>{error.message}</span>
            </p>
            <button
              onClick={resetError}
              style={{
                background: 'linear-gradient(to r, #f97316, #ec4899, #f97316)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '1rem',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🔄 Recharger l'application
            </button>
          </div>
        </div>
      )}
      showDialog
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
