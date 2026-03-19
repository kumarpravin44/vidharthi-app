/**
 * Cache utility for localStorage with expiry support
 */

export const CACHE_KEYS = {
  NAV_CATEGORIES: 'nav_categories',
  CATEGORIES_TREE: 'categories_tree',
};

const CACHE_DURATION = {
  NAV_CATEGORIES: 24 * 60 * 60 * 1000, // 24 hours
  CATEGORIES_TREE: 12 * 60 * 60 * 1000, // 12 hours
};

/**
 * Set cache with expiry
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} duration - Duration in milliseconds (optional, uses default for key)
 */
export const setCache = (key, data, duration = null) => {
  try {
    const expiryTime = Date.now() + (duration || CACHE_DURATION[key] || 3600000);
    const cacheItem = {
      data,
      expiry: expiryTime,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

/**
 * Get cache if not expired
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const getCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheItem = JSON.parse(cached);
    const now = Date.now();

    // Check if expired
    if (now > cacheItem.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheItem.data;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

/**
 * Clear specific cache
 * @param {string} key - Cache key
 */
export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all caches
 */
export const clearAllCaches = () => {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
};

/**
 * Check if cache is valid
 * @param {string} key - Cache key
 * @returns {boolean}
 */
export const isCacheValid = (key) => {
  const cached = getCache(key);
  return cached !== null;
};