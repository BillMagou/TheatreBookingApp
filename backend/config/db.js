const mariadb = require("mariadb");

const pool = mariadb.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "theatre_booking_db",
    port: Number(process.env.DB_PORT) || 3306,
    connectionLimit: 5
});

module.exports = pool;
