const mysql = require('mysql2');
const dotenv = require('dotenv').config();

exports.pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || process.env.DB_PASSWORD,
  database: process.env.DB || process.env.DB_NAME,
  connectionLimit : 10,
});
