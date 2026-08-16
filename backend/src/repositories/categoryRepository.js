const db = require("../config/db");

// Create Category
const createCategory = async (name, description) => {

    const query = `
        INSERT INTO categories
        (name, description)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const result = await db.query(query, [name, description]);

    return result.rows[0];
};

// Get All Categories
const getAllCategories = async () => {

    const query = `
        SELECT *
        FROM categories
        ORDER BY id;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Get Category By ID
const getCategoryById = async (id) => {

    const query = `
        SELECT *
        FROM categories
        WHERE id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

// Update Category
const updateCategory = async (id, name, description) => {

    const query = `
        UPDATE categories
        SET
            name = $1,
            description = $2
        WHERE id = $3
        RETURNING *;
    `;

    const result = await db.query(query, [
        name,
        description,
        id
    ]);

    return result.rows[0];
};

// Delete Category
const deleteCategory = async (id) => {

    const query = `
        DELETE FROM categories
        WHERE id = $1
        RETURNING *;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};