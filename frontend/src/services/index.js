import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post("/auth/change-password", { oldPassword, newPassword });
    return response.data;
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export const bannerService = {
  getActive: async () => { const r = await api.get("/banners/active"); return r.data; },
  getAll: async () => { const r = await api.get("/banners"); return r.data; },
  getById: async (id) => { const r = await api.get("/banners/" + id); return r.data; },
  create: async (fd) => { const r = await api.post("/banners", fd, ); return r.data; },
  update: async (id, fd) => { const r = await api.put("/banners/" + id, fd, ); return r.data; },
  delete: async (id) => { const r = await api.delete("/banners/" + id); return r.data; },
};

export const articleService = {
  getPublished: async (params) => { const r = await api.get("/articles/published", { params }); return r.data; },
  getBySlug: async (slug) => { const r = await api.get("/articles/slug/" + slug); return r.data; },
  getAll: async (params) => { const r = await api.get("/articles", { params }); return r.data; },
  getById: async (id) => { const r = await api.get("/articles/" + id); return r.data; },
  create: async (fd) => { const r = await api.post("/articles", fd, ); return r.data; },
  update: async (id, fd) => { const r = await api.put("/articles/" + id, fd, ); return r.data; },
  delete: async (id) => { const r = await api.delete("/articles/" + id); return r.data; },
};

export const activityService = {
  getActive: async (params) => { const r = await api.get("/activities/active", { params }); return r.data; },
  getBySlug: async (slug) => { const r = await api.get("/activities/slug/" + slug); return r.data; },
  getAll: async (params) => { const r = await api.get("/activities", { params }); return r.data; },
  getById: async (id) => { const r = await api.get("/activities/" + id); return r.data; },
  create: async (fd) => { const r = await api.post("/activities", fd, ); return r.data; },
  update: async (id, fd) => { const r = await api.put("/activities/" + id, fd, ); return r.data; },
  delete: async (id) => { const r = await api.delete("/activities/" + id); return r.data; },
};

export const galleryService = {
  getAll: async (params) => { const r = await api.get("/gallery", { params }); return r.data; },
  getById: async (id) => { const r = await api.get("/gallery/" + id); return r.data; },
  create: async (fd) => { const r = await api.post("/gallery", fd, ); return r.data; },
  update: async (id, fd) => { const r = await api.put("/gallery/" + id, fd, ); return r.data; },
  delete: async (id) => { const r = await api.delete("/gallery/" + id); return r.data; },
};

export const prayerTimeService = {
  getToday: async () => { const r = await api.get("/prayer-times/today"); return r.data; },
  getMonthly: async (m, y) => { const r = await api.get("/prayer-times/monthly", { params: { month: m, year: y } }); return r.data; },
  getSettings: async () => { const r = await api.get("/prayer-times/settings"); return r.data; },
  updateSettings: async (d) => { const r = await api.put("/prayer-times/settings", d); return r.data; },
};

export const donationService = {
  getActiveAccounts: async () => { const r = await api.get("/donations/accounts/active"); return r.data; },
  getActiveCampaigns: async () => { const r = await api.get("/donations/campaigns/active"); return r.data; },
  getAllAccounts: async () => { const r = await api.get("/donations/accounts"); return r.data; },
  createAccount: async (fd) => { const r = await api.post("/donations/accounts", fd, ); return r.data; },
  updateAccount: async (id, fd) => { const r = await api.put("/donations/accounts/" + id, fd, ); return r.data; },
  deleteAccount: async (id) => { const r = await api.delete("/donations/accounts/" + id); return r.data; },
  getAllCampaigns: async () => { const r = await api.get("/donations/campaigns"); return r.data; },
  createCampaign: async (fd) => { const r = await api.post("/donations/campaigns", fd, ); return r.data; },
  updateCampaign: async (id, fd) => { const r = await api.put("/donations/campaigns/" + id, fd, ); return r.data; },
  deleteCampaign: async (id) => { const r = await api.delete("/donations/campaigns/" + id); return r.data; },
};

export const announcementService = {
  getActive: async () => { const r = await api.get("/announcements/active"); return r.data; },
  getAll: async (params) => { const r = await api.get("/announcements", { params }); return r.data; },
  getById: async (id) => { const r = await api.get("/announcements/" + id); return r.data; },
  create: async (d) => { const r = await api.post("/announcements", d); return r.data; },
  update: async (id, d) => { const r = await api.put("/announcements/" + id, d); return r.data; },
  delete: async (id) => { const r = await api.delete("/announcements/" + id); return r.data; },
};

export const aboutService = {
  get: async () => { const r = await api.get("/about"); return r.data; },
  update: async (fd) => { const r = await api.put("/about", fd, ); return r.data; },
};

export const managementService = {
  getAll: async () => { const r = await api.get("/management"); return r.data; },
  getById: async (id) => { const r = await api.get("/management/" + id); return r.data; },
  create: async (fd) => { const r = await api.post("/management", fd, ); return r.data; },
  update: async (id, fd) => { const r = await api.put("/management/" + id, fd, ); return r.data; },
  delete: async (id) => { const r = await api.delete("/management/" + id); return r.data; },
};

export const settingService = {
  getPublic: async () => { const r = await api.get("/settings/public"); return r.data; },
  getAll: async (params) => { const r = await api.get("/settings", { params }); return r.data; },
  getByKey: async (key) => { const r = await api.get("/settings/" + key); return r.data; },
  upsert: async (d) => { const r = await api.post("/settings", d); return r.data; },
  bulkUpdate: async (settings) => { const r = await api.post("/settings/bulk", { settings }); return r.data; },
  delete: async (key) => { const r = await api.delete("/settings/" + key); return r.data; },
};

export const userService = {
  getAll: async (params) => { const r = await api.get("/users", { params }); return r.data; },
  getById: async (id) => { const r = await api.get("/users/" + id); return r.data; },
  create: async (d) => { const r = await api.post("/users", d); return r.data; },
  update: async (id, d) => { const r = await api.put("/users/" + id, d); return r.data; },
  delete: async (id) => { const r = await api.delete("/users/" + id); return r.data; },
};

export const dashboardService = {
  getStats: async () => { const r = await api.get("/dashboard/stats"); return r.data; },
};

export { getImageUrl } from "./api";
