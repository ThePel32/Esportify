require('dotenv').config();
const mysql = require('mysql2');
const cfg = require('./db.config');

function poolFromUrl(urlStr) {
  const u = new URL(urlStr);
  return mysql.createPool({
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username || ''),
    password: decodeURIComponent(u.password || ''),
    database: u.pathname.replace(/^\//, ''),
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_POOL_LIMIT || 10),
    connectTimeout: Number(process.env.MYSQL_CONNECT_TIMEOUT || 10000),
    ssl: process.env.MYSQL_SSL === 'true'
  });
}

const SQL_DISABLED =
  (process.env.NODE_ENV === 'production' && !process.env.JAWSDB_URL) ||
  process.env.DISABLE_SQL === '1';

if (SQL_DISABLED) {
  console.warn('[db] SQL désactivé en production (pas de JAWSDB_URL) ou DISABLE_SQL=1');
  module.exports = {
    query: async () => { throw new Error('SQL disabled in this environment'); },
    getPool: () => null,
  };
} else {
  const pool = process.env.JAWSDB_URL
    ? poolFromUrl(process.env.JAWSDB_URL)
    : mysql.createPool({
        host: cfg.HOST,
        port: cfg.PORT,
        user: cfg.USER,
        password: cfg.PASSWORD,
        database: cfg.DB,
        waitForConnections: true,
        connectionLimit: Number(process.env.MYSQL_POOL_LIMIT || 10),
        connectTimeout: cfg.connectTimeout
      });

  const promisePool = pool.promise();

  async function query(sql, params = []) {
    const [rows] = await promisePool.query(sql, params);
    return rows;
  }
  function getPool() {
    return promisePool;
  }

  module.exports = { query, getPool };
}
