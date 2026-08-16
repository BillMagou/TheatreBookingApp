const pool = require("../config/db");

const getAllTheatres = async (search = "") => {
    const term = search.trim();

    if (term) {
        const likeTerm = `%${term}%`;
        return await pool.query(
            `SELECT theatre_id, name, location, description
             FROM theatres
             WHERE name LIKE ? OR location LIKE ?
             ORDER BY name`,
            [likeTerm, likeTerm]
        );
    }

    return await pool.query(
        `SELECT theatre_id, name, location, description
         FROM theatres
         ORDER BY name`
    );
};

module.exports = {
    getAllTheatres
};
