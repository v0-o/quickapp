/**
 * Retry utility for handling network failures
 * @param {Function} fn - The async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} - The result of the function
 */
export async function retryWithBackoff(fn, options = {}) {
    const {
        maxRetries = 3,
        initialDelay = 300,
        maxDelay = 3000,
        backoffFactor = 2,
        onRetry = null,
    } = options;

    let lastError;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries) {
                throw error;
            }

            if (onRetry) {
                onRetry(attempt + 1, error);
            }

            // Wait before retrying with exponential backoff
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay = Math.min(delay * backoffFactor, maxDelay);
        }
    }

    throw lastError;
}

/**
 * Retry specifically for video loading
 * @param {string} src - Video source URL
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {Promise<void>}
 */
export async function retryVideoLoad(src, videoElement) {
    return retryWithBackoff(
        async () => {
            return new Promise((resolve, reject) => {
                const handleLoad = () => {
                    cleanup();
                    resolve();
                };

                const handleError = (error) => {
                    cleanup();
                    reject(error);
                };

                const cleanup = () => {
                    videoElement.removeEventListener('loadeddata', handleLoad);
                    videoElement.removeEventListener('error', handleError);
                };

                videoElement.addEventListener('loadeddata', handleLoad, { once: true });
                videoElement.addEventListener('error', handleError, { once: true });

                videoElement.src = src;
                videoElement.load();
            });
        },
        {
            maxRetries: 3,
            initialDelay: 500,
            onRetry: (attempt, error) => {
                console.log(`Retrying video load (attempt ${attempt}/3):`, src, error);
            },
        }
    );
}
