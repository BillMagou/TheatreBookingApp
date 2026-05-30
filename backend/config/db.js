const mariadb = require("mariadb");

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "theatre_booking_db",
    connectionLimit: 5
});

module.exports = pool;