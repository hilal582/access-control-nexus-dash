const API_BASE_URL = 'http://localhost:8000/api';

// Token management
export const getToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// API client with automatic token refresh
class ApiClient {
  private async request(url: string, options: RequestInit = {}) {
    const token = getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    let response = await fetch(`${API_BASE_URL}${url}`, config);

    // If token expired, try to refresh
    if (response.status === 401 && token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry with new token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${getToken()}`,
        };
        response = await fetch(`${API_BASE_URL}${url}`, config);
      }
    }

    return response;
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    clearTokens();
    return false;
  }

  async get(url: string) {
    const response = await this.request(url);
    if (!response.ok) throw new Error(`GET ${url} failed`);
    return response.json();
  }

  async post(url: string, data?: any) {
    const response = await this.request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `POST ${url} failed`);
    }
    return response.json();
  }

  async put(url: string, data?: any) {
    const response = await this.request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw new Error(`PUT ${url} failed`);
    return response.json();
  }

  async delete(url: string) {
    const response = await this.request(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`DELETE ${url} failed`);
    return response.status === 204 ? null : response.json();
  }
}

export const api = new ApiClient();

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  
  logout: () => {
    const refresh = getRefreshToken();
    if (refresh) {
      api.post('/auth/logout/', { refresh }).catch(() => {});
    }
    clearTokens();
  },
  
  getProfile: () => api.get('/auth/profile/'),
  
  updateProfile: (data: { first_name?: string; last_name?: string }) =>
    api.put('/auth/profile/update/', data),
  
  requestPasswordReset: (email: string) =>
    api.post('/auth/password-reset/request/', { email }),
  
  verifyPasswordReset: (email: string, otp: string, new_password: string) =>
    api.post('/auth/password-reset/verify/', { email, otp, new_password }),
};

// Users API (Admin only)
export const usersApi = {
  getUsers: () => api.get('/auth/users/'),
  
  createUser: (userData: {
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
  }) => api.post('/auth/users/', userData),
  
  getAllPermissions: () => api.get('/auth/permissions/'),
  
  getUserPermissions: (userId: number) =>
    api.get(`/auth/permissions/user/${userId}/`),
  
  updateUserPermissions: (userId: number, permissions: Record<string, string[]>) =>
    api.post(`/auth/permissions/update/${userId}/`, { permissions }),
};

// Pages API
export const pagesApi = {
  getAvailablePages: () => api.get('/pages/available/'),
  
  getPagePermissions: (page: string) =>
    api.get(`/pages/${page}/permissions/`),
  
  getComments: (page: string) => api.get(`/pages/${page}/comments/`),
  
  createComment: (page: string, content: string) =>
    api.post(`/pages/${page}/comments/`, { content }),
  
  updateComment: (commentId: number, content: string) =>
    api.put(`/pages/comments/${commentId}/`, { content }),
  
  deleteComment: (commentId: number) =>
    api.delete(`/pages/comments/${commentId}/`),
  
  getCommentHistory: (commentId: number) =>
    api.get(`/pages/comments/${commentId}/history/`),
};