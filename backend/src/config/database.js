const { Sequelize } = require('sequelize');
const config = require('./index');

let _instance = null;

const getSequelize = () => {
  if (_instance) return _instance;
  
  if (config.database.type === 'postgres') {
    _instance = new Sequelize(
      config.database.name, config.database.user, config.database.password,
      {
        host: config.database.host, port: config.database.port,
        dialect: 'postgres',
        logging: config.nodeEnv === 'development' ? console.log : false,
        dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      }
    );
  } else {
    _instance = new Sequelize(
      config.database.name, config.database.user, config.database.password,
      {
        host: config.database.host, port: config.database.port,
        dialect: 'mysql',
        logging: config.nodeEnv === 'development' ? console.log : false,
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      }
    );
  }
  return _instance;
};

const testConnection = async () => {
  try {
    await getSequelize().authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Lazy proxy that initializes Sequelize on first property access
const sequelize = new Proxy({}, {
  get(_, prop) {
    const s = getSequelize();
    return typeof s[prop] === 'function' ? s[prop].bind(s) : s[prop];
  }
});

module.exports = { sequelize, getSequelize, testConnection };