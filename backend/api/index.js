// Vercel serverless entry - Express with all routes, try full app first
let app;
try {
  // Try loading full Express app
  app = require('../server');
} catch (err) {
  // Fallback: minimal serverless API using Supabase direct
  const express = require('express');
  const { createClient } = require('@supabase/supabase-js');

  app = express();
  app.use(express.json());

  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://biewqhpuwqugkzaaelgz.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZXdxaHB1d3F1Z2t6YWFlbGd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTEyMDI4NCwiZXhwIjoyMDk2Njk2Mjg0fQ.bIgLbW9hc_gQ5rr5SiVDWNQae_ocPppXDFIJLkGSgL0',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const toCamel = s => s.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
  const mapKeys = (obj, fn) => { const r = {}; for (const k in obj) r[fn(k)] = obj[k]; return r; };
  const toSnake = s => s.replace(/[A-Z]/g, l => '_' + l.toLowerCase());
  const simplify = data => {
    if (!data) return null;
    if (Array.isArray(data)) return data.map(d => mapKeys(d, toCamel));
    return mapKeys(data, toCamel);
  };

  // Helper for Supabase queries
  const db = {
    findAll: async (table, opts = {}) => {
      let q = supabase.from(table).select('*');
      if (opts.where) Object.entries(mapKeys(opts.where, toSnake)).forEach(([k, v]) => { q = q.eq(k, v); });
      if (opts.orderBy) {
        const orders = Array.isArray(opts.orderBy) ? opts.orderBy : [opts.orderBy];
        orders.forEach(o => { const [c, d] = o.split(' '); q = q.order(c, { ascending: d === 'ASC' }); });
      }
      if (opts.limit) q = q.limit(opts.limit);
      const { data } = await q;
      return simplify(data || []);
    },
    findOne: async (table, where) => {
      let q = supabase.from(table).select('*');
      Object.entries(mapKeys(where, toSnake)).forEach(([k, v]) => { q = q.eq(k, v); });
      const { data } = await q.limit(1).maybeSingle();
      return simplify(data);
    },
  };

  // CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // Health
  app.get('/api/health', (req, res) => res.json({ success: true, message: 'API running (Supabase)' }));

  // Public: Banners
  app.get('/api/banners/active', async (req, res) => {
    try {
      const data = await db.findAll('banners', { where: { isActive: true }, orderBy: 'sort_order ASC' });
      res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Prayer Times
  app.get('/api/prayer-times/today', async (req, res) => {
    try {
      const settings = await db.findOne('prayer_times', {});
      if (!settings) return res.json({ success: true, data: { timings: {}, location: { city: 'Jakarta', country: 'Indonesia' } } });
      // Try fetching from Aladhan API
      const axios = require('axios');
      const today = new Date();
      const dateStr = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
      try {
        const ad = await axios.get('https://api.aladhan.com/v1/timingsByCity/' + dateStr, {
          params: { city: settings.city, country: settings.country, method: settings.method || 2 }
        });
        if (ad.data.code === 200) {
          const t = ad.data.data.timings;
          res.json({
            success: true,
            data: {
              date: ad.data.data.date.readable,
              timings: { fajr: t.Fajr, sunrise: t.Sunrise, dhuhr: t.Dhuhr, asr: t.Asr, maghrib: t.Maghrib, isha: t.Isha },
              location: { city: settings.city, country: settings.country }
            }
          });
          return;
        }
      } catch (_) {}
      res.json({ success: true, data: { timings: {}, location: { city: settings.city, country: settings.country } } });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Articles
  app.get('/api/articles/published', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await db.findAll('articles', {
        where: { status: 'published' }, orderBy: 'published_at DESC', limit
      });
      res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Activities
  app.get('/api/activities/active', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await db.findAll('activities', {
        where: { isActive: true }, orderBy: 'created_at DESC', limit
      });
      res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Announcements
  app.get('/api/announcements/active', async (req, res) => {
    try {
      const data = await db.findAll('announcements', {
        where: { isActive: true }, orderBy: 'priority DESC'
      });
      res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Settings
  app.get('/api/settings/public', async (req, res) => {
    try {
      const data = await db.findAll('settings', {});
      const obj = {};
      data.forEach(s => { obj[s.key] = s.value; });
      res.json({ success: true, data: obj });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: About
  app.get('/api/about', async (req, res) => {
    try {
      const data = await supabase.from('about').select('*').limit(1).maybeSingle();
      res.json({ success: true, data: simplify(data.data) });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Management
  app.get('/api/management', async (req, res) => {
    try {
      const data = await db.findAll('management', { orderBy: 'sort_order ASC' });
      res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Gallery
  app.get('/api/gallery', async (req, res) => {
    try {
      const type = req.query.type;
      const where = type ? { type } : {};
      const data = await db.findAll('galleries', { where, orderBy: 'created_at DESC' });
      res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Donations
  app.get('/api/donations/accounts/active', async (req, res) => {
    try {
      const data = await db.findAll('donations', { where: { isActive: true } });
      res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  app.get('/api/donations/campaigns/active', async (req, res) => {
    try {
      const data = await db.findAll('donation_campaigns', { where: { isActive: true } });
      res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Articles by category
  app.get('/api/articles', async (req, res) => {
    try {
      let q = supabase.from('articles').select('*');
      if (req.query.category) q = q.eq('category', req.query.category);
      if (req.query.status) q = q.eq('status', req.query.status);
      else q = q.eq('status', 'published');
      if (req.query.limit) q = q.limit(parseInt(req.query.limit));
      q = q.order('published_at', { ascending: false });
      const { data } = await q;
      res.json({ success: true, data: simplify(data || []) });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Single article by slug
  app.get('/api/articles/slug/:slug', async (req, res) => {
    try {
      const { data } = await supabase.from('articles').select('*').eq('slug', req.params.slug).single();
      res.json({ success: true, data: simplify(data) });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Activities with filtering
  app.get('/api/activities', async (req, res) => {
    try {
      let q = supabase.from('activities').select('*');
      if (req.query.category) q = q.eq('category', req.query.category);
      if (req.query.limit) q = q.limit(parseInt(req.query.limit));
      q = q.order('created_at', { ascending: false });
      const { data } = await q;
      res.json({ success: true, data: simplify(data || []) });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Public: Single activity by slug
  app.get('/api/activities/slug/:slug', async (req, res) => {
    try {
      const { data } = await supabase.from('activities').select('*').eq('slug', req.params.slug).single();
      res.json({ success: true, data: simplify(data) });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Auth: Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const bcrypt = require('bcryptjs');
      const jwt = require('jsonwebtoken');
      const { data: users } = await supabase.from('users').select('*').eq('email', email).limit(1);
      const user = users?.[0];
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ success: false, message: 'Email atau password salah' });
      if (!user.is_active) return res.status(401).json({ success: false, message: 'Akun tidak aktif' });
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
      const { password: _, ...safeUser } = user;
      res.json({ success: true, message: 'Login berhasil', data: { token, user: safeUser } });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Auth: Me
  app.get('/api/auth/me', async (req, res) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'default_secret_key');
      const { data: user } = await supabase.from('users').select('*').eq('id', decoded.id).single();
      if (!user) return res.status(401).json({ success: false, message: 'User tidak ditemukan' });
      const { password: _, ...safeUser } = user;
      res.json({ success: true, data: safeUser });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  });

  // Fallback
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) return res.status(200).json({ success: true, message: 'Web Masjid API' });
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
  });
}

module.exports = app;