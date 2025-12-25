import { useEffect } from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';
import { useUIStore } from '../../store/uiStore.js';

const ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const NotificationComponent = ({ message, isVisible, type = 'success' }) => {
  const { hideNotification } = useUIStore();

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      hideNotification();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, hideNotification]);

  return (
    <div
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 glass-dark px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 z-50 flex items-center gap-3 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
    >
      <span className="text-2xl">{ICONS[type] || ICONS.info}</span>
      <span className="text-white font-semibold text-sm">{message}</span>
    </div>
  );
};

export const Notification = registerTangerineComponent('Notification', NotificationComponent);

export default Notification;
