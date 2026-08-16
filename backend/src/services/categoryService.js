const categoryRepository = require("../repositories/categoryRepository");

// Create Category
const createCategory = async (name, description) => {

    if (!name) {
        throw new Error("Category name is required.");
    }

    return await categoryRepository.createCategory(
        name,
        description
    );
};

// Get All Categories
const getAllCategories = async () => {

    return await categoryRepository.getAllCategories();

};

// Get Category By ID
const getCategoryById = async (id) => {

    const category = await categoryRepository.getCategoryById(id);

    if (!category) {
        throw new Error("Category not found.");
    }

    return category;

};

// Update Category
const updateCategory = async (id, name, description) => {

    const category = await categoryRepository.updateCategory(
        id,
        name,
        description
    );

    if (!category) {
        throw new Error("Category not found.");
    }

    return category;

};

// Delete Category
const deleteCategory = async (id) => {

    const category = await categoryRepository.deleteCategory(id);

    if (!category) {
        throw new Error("Category not found.");
    }

    return category;

};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};