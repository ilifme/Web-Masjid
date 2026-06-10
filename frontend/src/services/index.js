import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const bannerService = {
  getActive: async () => {
    const response = await api.get('/banners/active');
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/banners');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(/banners/);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(/banners/, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(/banners/);
    return response.data;
  },
};

export const articleService = {
  getPublished: async (params) => {
    const response = await api.get('/articles/published', { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await api.get(/articles/slug/);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(/articles/);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(/articles/, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(/articles/);
    return response.data;
  },
};

export const activityService = {
  getActive: async (params) => {
    const response = await api.get('/activities/active', { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await api.get(/activities/slug/);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/activities', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(/activities/);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/activities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(/activities/, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(/activities/);
    return response.data;
  },
};

export const galleryService = {
  getAll: async (params) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(/gallery/);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(/gallery/, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(/gallery/);
    return response.data;
  },
};

export const prayerTimeService = {
  getToday: async () => {
    const response = await api.get('/prayer-times/today');
    return response.data;
  },

  getMonthly: async (month, year) => {
    const response = await api.get('/prayer-times/monthly', {
      params: { month, year },
    });
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/prayer-times/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/prayer-times/settings', data);
    return response.data;
  },
};

export const donationService = {
  getActiveAccounts: async () => {
    const response = await api.get('/donations/accounts/active');
    return response.data;
  },

  getActiveCampaigns: async () => {
    const response = await api.get('/donations/campaigns/active');
    return response.data;
  },

  getAllAccounts: async () => {
    const response = await api.get('/donations/accounts');
    return response.data;
  },

  createAccount: async (formData) => {
    const response = await api.post('/donations/accounts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateAccount: async (id, formData) => {
    const response = await api.put(/donations/accounts/, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAccount: async (id) => {
    const response = await api.delete(/donations/accounts/);
    return response.data;
  },

  getAllCampaigns: async () => {
    const response = await api.get('/donations/campaigns');
    return response.data;
  },

  createCampaign: async (formData) => {
    const response = await api.post('/donations/campaigns', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCampaign: async (id, formData) => {
    const response = await api.put(/donations/campaigns/, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteCampaign: async (id) => {
    const response = await api.delete(/donations/campaigns/);
    return response.data;
  },
};

export const announcementService = {
  getActive: async () => {
    const response = await api.get('/announcements/active');
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(/announcements/);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/announcements', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(/announcements/, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(/announcements/);
    return response.data;
  },
};

export const aboutService = {
  get: async () => {
    const response = await api.get('/about');
    return response.data;
  },

  update: async (formData) => {
    const response = await api.put('/about', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const managementService = {
  getAll: async () => {
    const response = await api.get('/management');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(/management/);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/management', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(/management/, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(/management/);
    return response.data;
  },
};

export const settingService = {
  getPublic: async () => {
    const response = await api.get('/settings/public');
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/settings', { params });
    return response.data;
  },

  getByKey: async (key) => {
    const response = await api.get(/settings/);
    return response.data;
  },

  upsert: async (data) => {
    const response = await api.post('/settings', data);
    return response.data;
  },

  bulkUpdate: async (settings) => {
    const response = await api.post('/settings/bulk', { settings });
    return response.data;
  },

  delete: async (key) => {
    const response = await api.delete(/settings/);
    return response.data;
  },
};

export const userService = {
  getAll: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(/users/);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(/users/, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(/users/);
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};
