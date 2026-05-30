const theatreService = require("../services/theatreService");

const getTheatres = async (req, res) => {
    try {
        const theatres = await theatreService.getAllTheatres();
        res.json(theatres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTheatres
};