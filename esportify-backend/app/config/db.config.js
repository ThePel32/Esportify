require('dotenv').config();

module.exports = {
  URL: process.env.JAWSDB_URL || process.env.MYSQL_URL || null,

  HOST: process.env.MYSQLHOST || '127.0.0.1',
  PORT: Number(process.env.MYSQLPORT || 3306),
  USER: process.env.MYSQLUSER || 'root',
  PASSWORD: process.env.MYSQLPASSWORD || '',
  DB: process.env.MYSQLDATABASE || 'esportify',

  connectionLimit: Number(process.env.MYSQL_POOL_LIMIT || 10),
  connectTimeout: Number(process.env.MYSQL_CONNECT_TIMEOUT || 10000),

  ssl: process.env.MYSQL_SSL === 'true'
};
