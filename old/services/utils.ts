import { logger } from '../utils/logger';

/**
 * Retry logic with exponential backoff for API calls
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            const isLastAttempt = attempt === maxRetries - 1;
            const errorMessage = error?.message || error?.toString() || '';

            if (errorMessage.includes('INVALID_API_KEY') || errorMessage.includes('API_KEY_INVALID')) {
                throw new Error('Invalid API key. Please check your .env.local file');
            }
            if (errorMessage.includes('INVALID_ARGUMENT')) {
                throw error;
            }
            if (isLastAttempt) {
                throw error;
            }

            const delay = baseDelay * Math.pow(2, attempt);
            logger.warn(`API call failed (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`, errorMessage);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Retry logic failed unexpectedly');
}
