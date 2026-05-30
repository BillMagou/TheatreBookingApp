const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const showRoutes = require("./routes/showRoutes");
const theatreRoutes = require("./routes/theatreRoutes");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/shows", showRoutes);
app.use("/theatres", theatreRoutes);
app.use("/users", userRoutes);
app.use("/reservations", reservationRoutes);

app.get("/", async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const result = await conn.query("SELECT 1 AS test");

        res.json({
            message: "Database connected",
            result
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    } finally {
        if (conn) conn.release();
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});