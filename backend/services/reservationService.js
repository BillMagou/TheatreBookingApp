const pool = require("../config/db");

const createReservation = async (userId, showId, seats) => {

    const result = await pool.query(
        "INSERT INTO reservations (user_id, show_id, seats) VALUES (?, ?, ?)",
        [userId, showId, seats]
    );

    return result;
};

const getReservations = async (userId) => {
    const rows = await pool.query(
        "SELECT * FROM reservations WHERE user_id = ?",
        [userId]
    );

    return rows;
};
const deleteReservation = async (reservationId) => {

    return await pool.query(
        "DELETE FROM reservations WHERE reservation_id = ?",
        [reservationId]
    );

};



module.exports = {
    createReservation,
    getReservations
};
module.exports = {
    createReservation,
    getReservations,
    deleteReservation
};