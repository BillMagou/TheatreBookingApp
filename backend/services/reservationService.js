const pool = require("../config/db");

const createReservation = async (userId, showId, seats) => {
    let conn;

    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const shows = await conn.query(
            "SELECT show_id, available_seats FROM shows WHERE show_id = ? FOR UPDATE",
            [showId]
        );

        if (!shows.length) {
            const error = new Error("Show not found");
            error.statusCode = 404;
            throw error;
        }

        if (Number(shows[0].available_seats) < seats) {
            const error = new Error("Not enough available seats");
            error.statusCode = 400;
            throw error;
        }

        const result = await conn.query(
            "INSERT INTO reservations (user_id, show_id, seats) VALUES (?, ?, ?)",
            [userId, showId, seats]
        );

        await conn.query(
            "UPDATE shows SET available_seats = available_seats - ? WHERE show_id = ?",
            [seats, showId]
        );

        await conn.commit();
        return result;
    } catch (error) {
        if (conn) await conn.rollback();
        throw error;
    } finally {
        if (conn) conn.release();
    }
};

const getReservations = async (userId) => {
    return await pool.query(
        `SELECT r.reservation_id, r.user_id, r.show_id, r.seats,
                s.title, s.show_time, t.name AS theatre_name,
                t.location AS theatre_location
         FROM reservations r
         JOIN shows s ON r.show_id = s.show_id
         JOIN theatres t ON s.theatre_id = t.theatre_id
         WHERE r.user_id = ?
         ORDER BY s.show_time ASC`,
        [userId]
    );
};

const updateReservation = async (userId, reservationId, newSeats) => {
    let conn;

    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const reservations = await conn.query(
            `SELECT reservation_id, show_id, seats
             FROM reservations
             WHERE reservation_id = ? AND user_id = ?
             FOR UPDATE`,
            [reservationId, userId]
        );

        if (!reservations.length) {
            await conn.rollback();
            return { affectedRows: 0 };
        }

        const reservation = reservations[0];
        const oldSeats = Number(reservation.seats);
        const difference = newSeats - oldSeats;

        const shows = await conn.query(
            "SELECT available_seats FROM shows WHERE show_id = ? FOR UPDATE",
            [reservation.show_id]
        );

        if (!shows.length) {
            const error = new Error("Show not found");
            error.statusCode = 404;
            throw error;
        }

        if (difference > Number(shows[0].available_seats)) {
            const error = new Error("Not enough available seats");
            error.statusCode = 400;
            throw error;
        }

        const result = await conn.query(
            "UPDATE reservations SET seats = ? WHERE reservation_id = ? AND user_id = ?",
            [newSeats, reservationId, userId]
        );

        if (difference !== 0) {
            await conn.query(
                "UPDATE shows SET available_seats = available_seats - ? WHERE show_id = ?",
                [difference, reservation.show_id]
            );
        }

        await conn.commit();
        return result;
    } catch (error) {
        if (conn) await conn.rollback();
        throw error;
    } finally {
        if (conn) conn.release();
    }
};

const deleteReservation = async (userId, reservationId) => {
    let conn;

    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const reservations = await conn.query(
            `SELECT show_id, seats
             FROM reservations
             WHERE reservation_id = ? AND user_id = ?
             FOR UPDATE`,
            [reservationId, userId]
        );

        if (!reservations.length) {
            await conn.rollback();
            return { affectedRows: 0 };
        }

        const reservation = reservations[0];
        const result = await conn.query(
            "DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?",
            [reservationId, userId]
        );

        await conn.query(
            "UPDATE shows SET available_seats = available_seats + ? WHERE show_id = ?",
            [Number(reservation.seats), reservation.show_id]
        );

        await conn.commit();
        return result;
    } catch (error) {
        if (conn) await conn.rollback();
        throw error;
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    createReservation,
    getReservations,
    updateReservation,
    deleteReservation
};
