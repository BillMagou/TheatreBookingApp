const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const showRoutes = require("./routes/showRoutes");
const theatreRoutes = require("./routes/theatreRoutes");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userController = require("./controllers/userController");
const reservationController = require("./controllers/reservationController");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Existing routes
app.use("/shows", showRoutes);
app.use("/theatres", theatreRoutes);
app.use("/users", userRoutes);
app.use("/reservations", reservationRoutes);

// Assignment-compatible aliases
app.use("/movies", showRoutes);
app.use("/cinemas", theatreRoutes);
app.post("/register", userController.register);
app.post("/login", userController.login);
app.get("/user/reservations", authMiddleware, reservationController.getReservations);

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

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
