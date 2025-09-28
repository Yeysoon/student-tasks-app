// src/config/db.config.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
});

pool.on('connect', () => {
    console.log('✅ Conexión exitosa a PostgreSQL establecida.');
});

const query = (text, params) => pool.query(text, params);

module.exports = {
    query,
    pool
};