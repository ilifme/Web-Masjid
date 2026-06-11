const supabase = require('./client');

const toSnake = (s) => s.replace(/[A-Z]/g, l => '_' + l.toLowerCase());
const toCamel = (s) => s.replace(/_([a-z])/g, (_, l) => l.toUpperCase());

const mapKeys = (obj, fn) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const result = {};
  Object.keys(obj).forEach(k => { result[fn(k)] = obj[k]; });
  return result;
};

const mapArray = (arr, fn) => {
  if (!arr) return arr;
  return arr.map(item => mapKeys(item, fn));
};

const simplify = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) return mapArray(data, toCamel);
  return mapKeys(data, toCamel);
};

const db = {
  findAll: async (table, opts = {}) => {
    let q = supabase.from(table).select(opts.select || '*');
    if (opts.where) {
      Object.entries(mapKeys(opts.where, toSnake)).forEach(([k, v]) => {
        if (v !== undefined && v !== null) q = q.eq(k, v);
      });
    }
    if (opts.orderBy) {
      const orders = Array.isArray(opts.orderBy) ? opts.orderBy : [opts.orderBy];
      orders.forEach(o => { const [c, d] = o.split(' '); q = q.order(c, { ascending: d === 'ASC' }); });
    }
    if (opts.limit) q = q.limit(opts.limit);
    if (opts.offset) q = q.range(opts.offset, opts.offset + (opts.limit || 10) - 1);
    const { data, error } = await q;
    if (error) throw error;
    return simplify(data || []);
  },

  findOne: async (table, where = {}) => {
    let q = supabase.from(table).select('*');
    Object.entries(mapKeys(where, toSnake)).forEach(([k, v]) => {
      if (v !== undefined && v !== null) q = q.eq(k, v);
    });
    const { data, error } = await q.limit(1).maybeSingle();
    if (error) throw error;
    return simplify(data);
  },

  findById: async (table, id) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return simplify(data);
  },

  create: async (table, data) => {
    const { data: result, error } = await supabase.from(table).insert(mapKeys(data, toSnake)).select().single();
    if (error) throw error;
    return simplify(result);
  },

  bulkCreate: async (table, dataArray) => {
    const { data: result, error } = await supabase.from(table).insert(dataArray.map(d => mapKeys(d, toSnake))).select();
    if (error) throw error;
    return simplify(result || []);
  },

  update: async (table, id, data) => {
    const { data: result, error } = await supabase.from(table).update(mapKeys(data, toSnake)).eq('id', id).select().single();
    if (error) throw error;
    return simplify(result);
  },

  remove: async (table, id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  count: async (table, where = {}) => {
    let q = supabase.from(table).select('*', { count: 'exact', head: true });
    Object.entries(mapKeys(where, toSnake)).forEach(([k, v]) => {
      if (v !== undefined && v !== null) q = q.eq(k, v);
    });
    const { count, error } = await q;
    if (error) throw error;
    return count || 0;
  }
};

module.exports = db;