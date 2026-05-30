const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const registerUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await pool.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
    );
};

const findUserByEmail = async (email) => {
    const rows = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

module.exports = {
    registerUser,
    findUserByEmail
};