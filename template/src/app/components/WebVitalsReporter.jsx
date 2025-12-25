import { useEffect } from 'react';
import { registerTangerineComponent } from '../../lib/registry.js';

const WebVitalsReporterComponent = () => {
    useEffect(() => {
        // Only run in production
        if (import.meta.env.DEV) return;

        // Dynamically import web-vitals library
        import('web-vitals').then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
            const sendToAnalytics = (metric) => {
                // Log to console for debugging
                console.log('[Web Vitals]', metric.name, metric.value, metric.rating);

                // Send to analytics if available
                if (typeof window.umami !== 'undefined' && typeof window.umami.track === 'function') {
                    window.umami.track('web_vitals', {
                        metric: metric.name,
                        value: Math.round(metric.value),
                        rating: metric.rating,
                        id: metric.id,
                    });
                }

                // Send to Sentry if available
                if (window.Sentry && typeof window.Sentry.captureMessage === 'function') {
                    window.Sentry.captureMessage(`Web Vital: ${metric.name}`, {
                        level: 'info',
                        tags: {
                            metric: metric.name,
                            rating: metric.rating,
                        },
                        extra: {
                            value: metric.value,
                            id: metric.id,
                            delta: metric.delta,
                        },
                    });
                }
            };

            // Register all Core Web Vitals
            onCLS(sendToAnalytics);
            onFID(sendToAnalytics);
            onLCP(sendToAnalytics);
            onFCP(sendToAnalytics);
            onTTFB(sendToAnalytics);
        }).catch((error) => {
            console.error('[Web Vitals] Failed to load:', error);
        });
    }, []);

    // This component doesn't render anything
    return null;
};

export const WebVitalsReporter = registerTangerineComponent(
    'WebVitalsReporter',
    WebVitalsReporterComponent,
);

export default WebVitalsReporter;
