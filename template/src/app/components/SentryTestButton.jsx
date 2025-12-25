import { useState } from 'react';

/**
 * TEMPORARY TEST COMPONENT - TO BE REMOVED AFTER SENTRY VERIFICATION
 * 
 * This component allows testing Sentry error capture.
 * Add it temporarily to your App.jsx to test, then remove it.
 */
export const SentryTestButton = () => {
    const [shouldThrow, setShouldThrow] = useState(false);

    if (shouldThrow) {
        throw new Error('🧪 Test Sentry Error - This is intentional for testing!');
    }

    return (
        <button
            onClick={() => setShouldThrow(true)}
            style={{
                position: 'fixed',
                bottom: '100px',
                right: '20px',
                zIndex: 9999,
                background: 'linear-gradient(to r, #ef4444, #dc2626)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                fontSize: '14px'
            }}
        >
            🧪 Test Sentry Error
        </button>
    );
};
