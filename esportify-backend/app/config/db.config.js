require('dotenv').config();

module.exports = {
  HOST: process.env.MYSQLHOST,
  USER: process.env.MYSQLUSER,
  PASSWORD: process.env.MYSQLPASSWORD,
  DB: process.env.MYSQLDATABASE,
  PORT: process.env.MYSQLPORT,
  connectTimeout: 10000,
};
