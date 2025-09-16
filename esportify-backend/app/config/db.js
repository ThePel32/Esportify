require('dotenv').config();
const mysql = require('mysql2');
const cfg = require('./db.config');

const SQL_DISABLED = process.env.DISABLE_SQL === '1' || process.env.DISABLE_SQL === 'true';
console.log(`[db] SQL_DISABLED=${SQL_DISABLED} | JAWSDB_URL=${process.env.JAWSDB_URL ? 'set' : 'unset'}`);

function boom() {
  const err = new Error('SQL disabled on this deployment');
  err.code = 'SQL_DISABLED';
  return err;
}

let promisePool = null;

if (!SQL_DISABLED) {
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

  promisePool = pool.promise();
}

async function query(sql, params = []) {
  if (SQL_DISABLED) throw boom();
  const [rows] = await promisePool.query(sql, params);
  return rows;
}

function getPool() {
  if (SQL_DISABLED) throw boom();
  return promisePool;
}

module.exports = { query, getPool };
