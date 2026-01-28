/**
 * Throttle function to limit how often a callback is executed
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Minimum time between executions in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(callback, delay) {
  let lastRun = 0;
  let timeoutId = null;

  return function (...args) {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun;

    if (timeSinceLastRun >= delay) {
      callback.apply(this, args);
      lastRun = now;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback.apply(this, args);
        lastRun = Date.now();
      }, delay - timeSinceLastRun);
    }
  };
}

/**
 * RequestAnimationFrame based throttle for scroll events
 * More efficient for scroll events
 */
export function rafThrottle(callback) {
  let rafId = null;
  let lastArgs = null;

  return function (...args) {
    lastArgs = args;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        callback.apply(this, lastArgs);
        rafId = null;
      });
    }
  };
}
