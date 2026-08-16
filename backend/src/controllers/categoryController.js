const categoryService = require("../services/categoryService");

// Create Category
const createCategory = async (req, res) => {

    try {

        const { name, description } = req.body;

        const category = await categoryService.createCategory(
            name,
            description
        );

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

// Get All Categories
const getAllCategories = async (req, res) => {

    try {

        const categories = await categoryService.getAllCategories();

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Category By ID
const getCategoryById = async (req, res) => {

    try {

        const category = await categoryService.getCategoryById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

// Update Category
const updateCategory = async (req, res) => {

    try {

        const { name, description } = req.body;

        const category = await categoryService.updateCategory(
            req.params.id,
            name,
            description
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Category
const deleteCategory = async (req, res) => {

    try {

        await categoryService.deleteCategory(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};