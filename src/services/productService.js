import { fetchAPI } from './api';
import { API_ENDPOINTS } from '../config/api';
import { getCache, setCache, CACHE_KEYS } from '../utils/cacheutils';


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

  // Get subcategories of a parent category
  getSubcategories: async (parentId) => {
    return await fetchAPI(`${API_ENDPOINTS.CATEGORIES.LIST}?parent_id=${parentId}`);
  },

 // Get categories tree (parents with children) - with caching
  getNavCategories: async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCache(CACHE_KEYS.NAV_CATEGORIES);
      if (cached) {
        // Return cached nav categories immediately
        return cached;
      }
    }
    // Fetch from API and update cache
    const data = await fetchAPI(API_ENDPOINTS.CATEGORIES.NAV);
    setCache(CACHE_KEYS.NAV_CATEGORIES, data);
    return data;
  },

  // Get top-level categories only
  getTopLevelCategories: async () => {
    return await fetchAPI(`${API_ENDPOINTS.CATEGORIES.LIST}?top_level=true`);
  },

  // Get categories tree (parents with children) - with caching
  getCategoriesTree: async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCache(CACHE_KEYS.CATEGORIES_TREE);
      if (cached) {
        return cached;
      }
    }
    const data = await fetchAPI(API_ENDPOINTS.CATEGORIES.TREE);
    setCache(CACHE_KEYS.CATEGORIES_TREE, data);
    return data;
  },

  getCategoryDetails: async (id) => {
    return await fetchAPI(`/categories/${id}/details`);
  },

};
