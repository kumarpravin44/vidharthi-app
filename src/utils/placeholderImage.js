// Import the no image placeholder
import noImageAvailable from '../images/product/no_image_available.png';

// Use the imported image as placeholder
export const noImagePlaceholder = noImageAvailable;

/**
 * Get image URL with fallback to "No Image" placeholder
 * @param {string} imageUrl - The image URL from backend
 * @param {string} baseUrl - The base URL for relative paths
 * @returns {string} Full image URL or placeholder
 */
export const getImageWithFallback = (imageUrl, baseUrl = 'http://localhost:8000') => {
  if (!imageUrl) return noImagePlaceholder;
  
  // If already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative path, construct full URL
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Get avatar URL with proper server prefix
 * @param {string} avatarUrl - The avatar URL from backend (could be full or relative)
 * @param {string} baseUrl - The base server URL
 * @returns {string|null} Full avatar URL or null
 */
export const getAvatarUrl = (avatarUrl, baseUrl = 'http://localhost:8000') => {
  if (!avatarUrl) return null;
  
  // If already a full URL, return as-is
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }
  
  // If relative path, construct full URL
  const cleanPath = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
  return `${baseUrl}${cleanPath}`;
};
