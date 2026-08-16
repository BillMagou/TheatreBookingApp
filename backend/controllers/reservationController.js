const reservationService = require("../services/reservationService");

const isValidSeatCount = (seats) => {
    const value = Number(seats);
    return Number.isInteger(value) && value > 0;
};

const sendError = (res, error) => {
    res.status(error.statusCode || 500).json({
        message: error.message || "Reservation operation failed"
    });
};

const createReservation = async (req, res) => {
    try {
        const { show_id, seats } = req.body;
        const showId = Number(show_id);

        if (!Number.isInteger(showId) || showId <= 0 || !isValidSeatCount(seats)) {
            return res.status(400).json({
                message: "Show and a positive number of seats are required"
            });
        }

        await reservationService.createReservation(
            req.user.id,
            showId,
            Number(seats)
        );

        res.status(201).json({
            message: "Reservation created successfully"
        });
    } catch (error) {
        sendError(res, error);
    }
};

const getReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getReservations(req.user.id);
        res.json(reservations);
    } catch (error) {
        sendError(res, error);
    }
};

const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { seats } = req.body;

        if (!isValidSeatCount(seats)) {
            return res.status(400).json({
                message: "A positive number of seats is required"
            });
        }

        const result = await reservationService.updateReservation(
            req.user.id,
            id,
            Number(seats)
        );

        if (!result.affectedRows) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.json({ message: "Reservation updated successfully" });
    } catch (error) {
        sendError(res, error);
    }
};

const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await reservationService.deleteReservation(req.user.id, id);

        if (!result.affectedRows) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.json({ message: "Reservation cancelled successfully" });
    } catch (error) {
        sendError(res, error);
    }
};

module.exports = {
    createReservation,
    getReservations,
    updateReservation,
    deleteReservation
};
