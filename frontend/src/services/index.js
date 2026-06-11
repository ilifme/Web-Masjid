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

function mkTpl(str) { return bt + str + bt; }

function mkTplId(str, id) { return bt + str + d + "{id}" + bt; }

export const bannerService = {
  getActive: async () => { const r = await api.get("/banners/active"); return r.data; },
  getAll: async () => { const r = await api.get("/banners"); return r.data; },
  getById: async (id) => { const r = await api.get(mkTplId("/banners/", id)); return r.data; },
  create: async (fd) => { const r = await api.post("/banners", fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  update: async (id, fd) => { const r = await api.put(mkTplId("/banners/", id), fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  delete: async (id) => { const r = await api.delete(mkTplId("/banners/", id)); return r.data; },
};

export const articleService = {
  getPublished: async (params) => { const r = await api.get("/articles/published", { params }); return r.data; },
  getBySlug: async (slug) => { const r = await api.get(bt + "/articles/slug/" + d + "{slug}" + bt); return r.data; },
  getAll: async (params) => { const r = await api.get("/articles", { params }); return r.data; },
  getById: async (id) => { const r = await api.get(mkTplId("/articles/", id)); return r.data; },
  create: async (fd) => { const r = await api.post("/articles", fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  update: async (id, fd) => { const r = await api.put(mkTplId("/articles/", id), fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  delete: async (id) => { const r = await api.delete(mkTplId("/articles/", id)); return r.data; },
};

export const activityService = {
  getActive: async (params) => { const r = await api.get("/activities/active", { params }); return r.data; },
  getBySlug: async (slug) => { const r = await api.get(bt + "/activities/slug/" + d + "{slug}" + bt); return r.data; },
  getAll: async (params) => { const r = await api.get("/activities", { params }); return r.data; },
  getById: async (id) => { const r = await api.get(mkTplId("/activities/", id)); return r.data; },
  create: async (fd) => { const r = await api.post("/activities", fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  update: async (id, fd) => { const r = await api.put(mkTplId("/activities/", id), fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  delete: async (id) => { const r = await api.delete(mkTplId("/activities/", id)); return r.data; },
};

export const galleryService = {
  getAll: async (params) => { const r = await api.get("/gallery", { params }); return r.data; },
  getById: async (id) => { const r = await api.get(mkTplId("/gallery/", id)); return r.data; },
  create: async (fd) => { const r = await api.post("/gallery", fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  update: async (id, fd) => { const r = await api.put(mkTplId("/gallery/", id), fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  delete: async (id) => { const r = await api.delete(mkTplId("/gallery/", id)); return r.data; },
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
  createAccount: async (fd) => { const r = await api.post("/donations/accounts", fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  updateAccount: async (id, fd) => { const r = await api.put(mkTplId("/donations/accounts/", id), fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  deleteAccount: async (id) => { const r = await api.delete(mkTplId("/donations/accounts/", id)); return r.data; },
  getAllCampaigns: async () => { const r = await api.get("/donations/campaigns"); return r.data; },
  createCampaign: async (fd) => { const r = await api.post("/donations/campaigns", fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  updateCampaign: async (id, fd) => { const r = await api.put(mkTplId("/donations/campaigns/", id), fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  deleteCampaign: async (id) => { const r = await api.delete(mkTplId("/donations/campaigns/", id)); return r.data; },
};

export const announcementService = {
  getActive: async () => { const r = await api.get("/announcements/active"); return r.data; },
  getAll: async (params) => { const r = await api.get("/announcements", { params }); return r.data; },
  getById: async (id) => { const r = await api.get(mkTplId("/announcements/", id)); return r.data; },
  create: async (d) => { const r = await api.post("/announcements", d); return r.data; },
  update: async (id, d) => { const r = await api.put(mkTplId("/announcements/", id), d); return r.data; },
  delete: async (id) => { const r = await api.delete(mkTplId("/announcements/", id)); return r.data; },
};

export const aboutService = {
  get: async () => { const r = await api.get("/about"); return r.data; },
  update: async (fd) => { const r = await api.put("/about", fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
};

export const managementService = {
  getAll: async () => { const r = await api.get("/management"); return r.data; },
  getById: async (id) => { const r = await api.get(mkTplId("/management/", id)); return r.data; },
  create: async (fd) => { const r = await api.post("/management", fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  update: async (id, fd) => { const r = await api.put(mkTplId("/management/", id), fd, { headers: { "Content-Type": "multipart/form-data" } }); return r.data; },
  delete: async (id) => { const r = await api.delete(mkTplId("/management/", id)); return r.data; },
};

export const settingService = {
  getPublic: async () => { const r = await api.get("/settings/public"); return r.data; },
  getAll: async (params) => { const r = await api.get("/settings", { params }); return r.data; },
  getByKey: async (key) => { const r = await api.get(bt + "/settings/" + d + "{key}" + bt); return r.data; },
  upsert: async (d) => { const r = await api.post("/settings", d); return r.data; },
  bulkUpdate: async (settings) => { const r = await api.post("/settings/bulk", { settings }); return r.data; },
  delete: async (key) => { const r = await api.delete(bt + "/settings/" + d + "{key}" + bt); return r.data; },
};

export const userService = {
  getAll: async (params) => { const r = await api.get("/users", { params }); return r.data; },
  getById: async (id) => { const r = await api.get(mkTplId("/users/", id)); return r.data; },
  create: async (d) => { const r = await api.post("/users", d); return r.data; },
  update: async (id, d) => { const r = await api.put(mkTplId("/users/", id), d); return r.data; },
  delete: async (id) => { const r = await api.delete(mkTplId("/users/", id)); return r.data; },
};

export const dashboardService = {
  getStats: async () => { const r = await api.get("/dashboard/stats"); return r.data; },
};

export { getImageUrl } from "./api";
