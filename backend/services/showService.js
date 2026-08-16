const pool = require("../config/db");

const getAllShows = async (theatreId) => {
    let sql = `
        SELECT
            s.show_id,
            s.theatre_id,
            s.title,
            s.duration,
            s.rating,
            s.show_time,
            s.available_seats,
            t.name AS theatre_name,
            t.location AS theatre_location,
            t.description AS theatre_description
        FROM shows s
        JOIN theatres t ON t.theatre_id = s.theatre_id
    `;

    const params = [];

    if (theatreId) {
        sql += " WHERE s.theatre_id = ?";
        params.push(theatreId);
    }

    sql += " ORDER BY s.show_time, s.title";

    return await pool.query(sql, params);
};

module.exports = {
    getAllShows
};
