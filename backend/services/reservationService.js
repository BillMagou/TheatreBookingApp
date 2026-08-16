const pool = require("../config/db");

const createReservation = async (userId, showId, seats) => {
    return await pool.query(
        "INSERT INTO reservations (user_id, show_id, seats) VALUES (?, ?, ?)",
        [userId, showId, seats]
    );
};

const getReservations = async (userId) => {
    return await pool.query(
        `SELECT r.reservation_id, r.user_id, r.show_id, r.seats,
                s.title, s.show_time
         FROM reservations r
         JOIN shows s ON r.show_id = s.show_id
         WHERE r.user_id = ?
         ORDER BY s.show_time ASC`,
        [userId]
    );
};

const updateReservation = async (userId, reservationId, seats) => {
    return await pool.query(
        "UPDATE reservations SET seats = ? WHERE reservation_id = ? AND user_id = ?",
        [seats, reservationId, userId]
    );
};

const deleteReservation = async (userId, reservationId) => {
    return await pool.query(
        "DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?",
        [reservationId, userId]
    );
};

module.exports = {
    createReservation,
    getReservations,
    updateReservation,
    deleteReservation
};
