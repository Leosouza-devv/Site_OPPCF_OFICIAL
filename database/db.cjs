const mysql = require('mysql2');
const dotenv = require('dotenv').config();

exports.pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  connectionLimit : 10,
});