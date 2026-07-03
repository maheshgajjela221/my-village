const { Pool } = require("pg");
require("dotenv").config();

const useSSL = process.env.DB_SSL === "true";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
