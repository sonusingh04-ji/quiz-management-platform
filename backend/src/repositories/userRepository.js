const pool = require("../config/db");

// Find user by email
const findUserByEmail = async (email) => {

    const query = `
        SELECT *
        FROM users
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0];
};

// Create user
const createUser = async (fullName, email, password, role = "student") => {

    const query = `
        INSERT INTO users (full_name, email, password, role)
        VALUES ($1, $2, $3, $4)
            RETURNING id, full_name, email, role, created_at;
    `;

    const values = [fullName, email, password, role];

    const result = await pool.query(query, values);

    return result.rows[0];
};

module.exports = {
    findUserByEmail,
    createUser
};