// Vercel serverless entry - minimal Express with Supabase direct
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://biewqhpuwqugkzaaelgz.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZXdxaHB1d3F1Z2t6YWFlbGd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTEyMDI4NCwiZXhwIjoyMDk2Njk2Mjg0fQ.bIgLbW9hc_gQ5rr5SiVDWNQae_ocPppXDFIJLkGSgL0',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running (Supabase mode)', timestamp: new Date().toISOString() });
});

// API Root
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Web Masjid API' });
});

// Echo endpoint for debugging
app.get('/api/echo', (req, res) => {
  res.json({ success: true, env: { db_type: process.env.DB_TYPE, node_env: process.env.NODE_ENV } });
});

module.exports = app;