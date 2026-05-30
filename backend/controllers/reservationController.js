const reservationService = require("../services/reservationService");

const createReservation = async (req, res) => {

    try {

        const { show_id, seats } = req.body;

        await reservationService.createReservation(
            req.user.id,
            show_id,
            seats
        );

        res.status(201).json({
            message: "Reservation created successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

const getReservations = async (req, res) => {

    try {

        const reservations =
            await reservationService.getReservations(req.user.id);

        res.json(reservations);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};
const deleteReservation = async (req, res) => {

    try {

        const { id } = req.params;

        await reservationService.deleteReservation(id);

        res.json({
            message: "Reservation cancelled successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

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