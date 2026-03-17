import { fetchAPI } from './api';
import { API_ENDPOINTS } from '../config/api';

export const productService = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.search) params.append('search', filters.search);
    if (filters.skip !== undefined) params.append('skip', filters.skip);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    
    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryString}` : API_ENDPOINTS.PRODUCTS.LIST;
    
    return await fetchAPI(endpoint);
  },

  // Get product by ID
  getProduct: async (id) => {
    return await fetchAPI(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  },

  // Get product with full details
  getProductDetail: async (id) => {
    return await fetchAPI(API_ENDPOINTS.PRODUCTS.FULL_DETAIL(id));
  },

  // Get categories for bottom navigation
  getNavCategories: async () => {
    return await fetchAPI(API_ENDPOINTS.CATEGORIES.NAV);
  },

  // Get all categories
  getCategories: async (skip = 0, limit = 100) => {
    return await fetchAPI(`${API_ENDPOINTS.CATEGORIES.LIST}?skip=${skip}&limit=${limit}`);
  },

  // Get category by ID
  getCategory: async (id) => {
    return await fetchAPI(API_ENDPOINTS.CATEGORIES.DETAIL(id));
  },
};
