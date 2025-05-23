const mysql = require("mysql2");
const dbConfig = require("./db.config.js");

const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT,
  connectTimeout: dbConfig.connectTimeout,
});

module.exports = connection;
