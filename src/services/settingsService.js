import { API_BASE_URL } from '../config/api';

/**
 * Fetch public application settings (no auth required).
 */
export async function getAppSettings() {
  const response = await fetch(`${API_BASE_URL}/app/settings`);
  if (!response.ok) {
    throw new Error('Failed to load app settings');
  }
  return response.json();
}
