const DEFAULT_THEME = {
  bg_color: '#05090b',
  text_color: '#f8fafc',
  hint_color: '#94a3b8',
  link_color: '#38bdf8',
  button_color: '#34d399',
  button_text_color: '#05090b',
  secondary_bg_color: '#0f172a',
};

let telegramApp = null;
let hasThemeListener = false;

const applyThemeVariables = (themeParams = {}, colorScheme = 'dark') => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const theme = { ...DEFAULT_THEME, ...themeParams };

  root.style.setProperty('--tg-bg-color', theme.bg_color);
  root.style.setProperty('--tg-text-color', theme.text_color);
  root.style.setProperty('--tg-hint-color', theme.hint_color);
  root.style.setProperty('--tg-link-color', theme.link_color);
  root.style.setProperty('--tg-button-color', theme.button_color);
  root.style.setProperty('--tg-button-text-color', theme.button_text_color);
  root.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color);
  root.style.setProperty('--tg-color-scheme', colorScheme || 'dark');
};

export const initTelegramApp = () => {
  if (typeof window === 'undefined') return null;
  if (telegramApp) return telegramApp;

  const webApp = window.Telegram?.WebApp;
  if (!webApp) {
    return null;
  }

  telegramApp = webApp;

  try {
    webApp.ready();
    webApp.expand();

    // Force full screen mode (new Telegram API)
    if (typeof webApp.requestFullscreen === 'function') {
      webApp.requestFullscreen();
    }

    // Disable vertical swipes (prevent accidental close)
    if (typeof webApp.disableVerticalSwipes === 'function') {
      webApp.disableVerticalSwipes();
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[Telegram] ready/expand/fullscreen failed', error);
    }
  }

  applyThemeVariables(webApp.themeParams, webApp.colorScheme);

  if (!hasThemeListener && typeof webApp.onEvent === 'function') {
    const handleThemeChange = () => {
      applyThemeVariables(webApp.themeParams, webApp.colorScheme);
    };
    webApp.onEvent('themeChanged', handleThemeChange);
    hasThemeListener = true;
  }

  return telegramApp;
};

export const getTelegramApp = () => telegramApp;

export const reapplyTelegramTheme = () => {
  if (!telegramApp) return;
  applyThemeVariables(telegramApp.themeParams, telegramApp.colorScheme);
};
