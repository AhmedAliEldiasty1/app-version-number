/**
 * Simple debounce implementation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Exponential backoff retry
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // If it's not a resource exhausted error, don't retry
      if (error.code !== "resource-exhausted") {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Keep track of last sync time
let lastSyncTime = 0;
const MIN_SYNC_INTERVAL = 2000; // 2 seconds minimum between syncs

export async function rateLimitedOperation<T>(
  operation: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const timeSinceLastSync = now - lastSyncTime;

  if (timeSinceLastSync < MIN_SYNC_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_SYNC_INTERVAL - timeSinceLastSync)
    );
  }

  lastSyncTime = Date.now();
  return withRetry(operation);
}
