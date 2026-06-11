require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || (process.env.DB_TYPE === 'postgres' ? 5432 : 3306),
    name: process.env.DB_NAME || 'web_masjid',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  },
  
  api: {
    url: process.env.API_URL || 'http://localhost:5000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  },
  
  prayerTimeApi: process.env.PRAYER_TIME_API || 'https://api.aladhan.com/v1/timingsByCity',
};
