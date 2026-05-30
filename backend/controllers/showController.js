const showService = require("../services/showService");

const getShows = async (req, res) => {
    try {
        const shows = await showService.getAllShows();
        res.json(shows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getShows
};