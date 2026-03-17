import { API_BASE_URL } from '../config/api';

// Admin API Service
class AdminService {
  async login(identifier, password) {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Invalid admin credentials' }));
      throw new Error(error.detail || 'Invalid admin credentials');
    }

    const data = await response.json();
    localStorage.setItem('admin_token', data.access_token);
    return data;
  }

  async getDashboardStats() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch stats' }));
      throw new Error(error.detail || 'Failed to fetch stats');
    }

    return response.json();
  }

  // Products
  async getProducts(params = {}) {
    const token = localStorage.getItem('admin_token');
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/products${queryString ? `?${queryString}` : ''}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }

  async createProduct(productData) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create product' }));
      throw new Error(error.detail || 'Failed to create product');
    }
    return response.json();
  }

  async updateProduct(id, productData) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update product' }));
      throw new Error(error.detail || 'Failed to update product');
    }
    return response.json();
  }

  async deleteProduct(id) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete product' }));
      throw new Error(error.detail || 'Failed to delete product');
    }
    return response.status === 204 ? null : response.json();
  }

  // Orders
  async getOrders(params = {}) {
    const token = localStorage.getItem('admin_token');
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/orders${queryString ? `?${queryString}` : ''}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  }

  async updateOrderStatus(orderId, status) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update order status' }));
      throw new Error(error.detail || 'Failed to update order status');
    }
    return response.json();
  }

  async getOrderDetail(orderId) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch order details' }));
      throw new Error(error.detail || 'Failed to fetch order details');
    }
    return response.json();
  }

  // Users
  async getUsers(params = {}) {
    const token = localStorage.getItem('admin_token');
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ''}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }

  async toggleUserStatus(userId, isActive) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update user status' }));
      throw new Error(error.detail || 'Failed to update user status');
    }
    return response.json();
  }

  // Categories
  async getCategories() {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }

  async toggleCategoryStatus(id) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to toggle category status' }));
      throw new Error(error.detail || 'Failed to toggle category status');
    }
    return response.json();
  }

  async createCategory(categoryData) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create category' }));
      throw new Error(error.detail || 'Failed to create category');
    }
    return response.json();
  }

  async updateCategory(id, categoryData) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update category' }));
      throw new Error(error.detail || 'Failed to update category');
    }
    return response.json();
  }

  async deleteCategory(id) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete category' }));
      throw new Error(error.detail || 'Failed to delete category');
    }
    return response.status === 204 ? null : response.json();
  }

  // Image Uploads
  async uploadCategoryImage(file) {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/admin/categories/upload-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to upload image' }));
      throw new Error(error.detail || 'Failed to upload image');
    }

    return response.json();
  }

  async uploadProductImage(file) {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/admin/products/upload-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to upload image' }));
      throw new Error(error.detail || 'Failed to upload image');
    }

    return response.json();
  }

  async getUploadedFiles(entityType, entityId) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/uploaded-files/${entityType}/${entityId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch uploaded files' }));
      throw new Error(error.detail || 'Failed to fetch uploaded files');
    }

    return response.json();
  }

  // Banners
  async getBanners() {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/banners`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch banners' }));
      throw new Error(error.detail || 'Failed to fetch banners');
    }

    return response.json();
  }

  async createBanner(bannerData) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/banners`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bannerData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create banner' }));
      throw new Error(error.detail || 'Failed to create banner');
    }

    return response.json();
  }

  async updateBanner(id, bannerData) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/banners/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bannerData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update banner' }));
      throw new Error(error.detail || 'Failed to update banner');
    }

    return response.json();
  }

  async toggleBannerStatus(id, isActive) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/banners/${id}/toggle?is_active=${isActive}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to toggle banner status' }));
      throw new Error(error.detail || 'Failed to toggle banner status');
    }

    return response.json();
  }

  async uploadBannerImage(file) {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/admin/banners/upload-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to upload banner image' }));
      throw new Error(error.detail || 'Failed to upload banner image');
    }

    return response.json();
  }

  // Offers
  async getOffers() {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/offers/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('401: Unauthorized');
      }
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch offers' }));
      throw new Error(error.detail || 'Failed to fetch offers');
    }

    return response.json();
  }

  async createOffer(offerData) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offerData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create offer' }));
      throw new Error(error.detail || 'Failed to create offer');
    }
    return response.json();
  }

  async updateOffer(id, offerData) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offerData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update offer' }));
      throw new Error(error.detail || 'Failed to update offer');
    }
    return response.json();
  }

  async deleteOffer(id) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete offer' }));
      throw new Error(error.detail || 'Failed to delete offer');
    }
    return response.status === 204 ? null : response.json();
  }

  async deactivateOffer(id) {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/offers/${id}/deactivate`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to deactivate offer' }));
      throw new Error(error.detail || 'Failed to deactivate offer');
    }
    return response.json();
  }

  logout() {
    localStorage.removeItem('admin_token');
  }

  isAuthenticated() {
    return !!localStorage.getItem('admin_token');
  }
}

export const adminService = new AdminService();
