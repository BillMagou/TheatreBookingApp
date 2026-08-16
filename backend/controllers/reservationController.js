const reservationService = require("../services/reservationService");

const isValidSeatCount = (seats) => {
    const value = Number(seats);
    return Number.isInteger(value) && value > 0;
};

const createReservation = async (req, res) => {
    try {
        const { show_id, seats } = req.body;

        if (!show_id || !isValidSeatCount(seats)) {
            return res.status(400).json({
                message: "Show and a positive number of seats are required"
            });
        }

        await reservationService.createReservation(
            req.user.id,
            show_id,
            Number(seats)
        );

        res.status(201).json({
            message: "Reservation created successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getReservations(req.user.id);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createReservation,
    getReservations,
    updateReservation,
    deleteReservation
};
