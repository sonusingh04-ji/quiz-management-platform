const db = require("../config/db");

const createUser = async (
    fullName,
    email,
    hashedPassword,
    role
) => {

    const result = await db.query(
        `
            INSERT INTO users (
                full_name,
                email,
                password,
                role
            )
            VALUES ($1, $2, $3, $4)
                RETURNING id, full_name, email, role
        `,
        [
            fullName,
            email,
            hashedPassword,
            role
        ]
    );

    return result.rows[0];
};
const findUserByEmail = async (email) => {

    const result = await db.query(
        `SELECT *
         FROM users
         WHERE email = $1`,
        [email]
    );

    return result.rows[0];
};
const saveResetToken = async (
    userId,
    token,
    expiry
) => {

    await db.query(
        `
        UPDATE users
        SET
            reset_token = $1,
            reset_token_expiry = $2
        WHERE id = $3
        `,
        [
            token,
            expiry,
            userId
        ]
    );

};
const getUserByResetToken = async (token) => {

    const result = await db.query(
        `
        SELECT *
        FROM users
        WHERE
            reset_token = $1
            AND reset_token_expiry > NOW()
        `,
        [token]
    );

    return result.rows[0];
};
const updatePassword = async (
    userId,
    hashedPassword
) => {

    await db.query(
        `
        UPDATE users
        SET
            password = $1,
            reset_token = NULL,
            reset_token_expiry = NULL
        WHERE id = $2
        `,
        [
            hashedPassword,
            userId
        ]
    );

};

module.exports = {
    createUser,
    findUserByEmail,
    saveResetToken,
    getUserByResetToken,
    updatePassword
};