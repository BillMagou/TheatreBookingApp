const pool = require("../config/db");

const getAllTheatres = async () => {
    const rows = await pool.query("SELECT * FROM theatres");
    return rows;
};

module.exports = {
    getAllTheatres
};