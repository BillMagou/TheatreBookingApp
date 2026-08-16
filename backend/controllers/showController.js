const showService = require("../services/showService");

const getShows = async (req, res) => {
    try {
        let theatreId;

        if (req.query.theatre_id !== undefined) {
            theatreId = Number(req.query.theatre_id);
            if (!Number.isInteger(theatreId) || theatreId <= 0) {
                return res.status(400).json({ message: "Invalid theatre_id" });
            }
        }

        const shows = await showService.getAllShows(theatreId);
        res.json(shows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getShows
};
