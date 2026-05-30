const pool = require("../config/db");

const getAllShows = async () => {
    const rows = await pool.query("SELECT * FROM shows");
    return rows;
};

module.exports = {
    getAllShows
};