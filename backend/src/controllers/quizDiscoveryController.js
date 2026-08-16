const quizDiscoveryService = require("../services/quizDiscoveryService");

// Get all quizzes
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizDiscoveryService.getAllQuizzes();

        res.status(200).json({
            success: true,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await quizDiscoveryService.getQuizById(id);

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Get quizzes by category
const getQuizzesByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const quizzes = await quizDiscoveryService.getQuizzesByCategory(category);

        res.status(200).json({
            success: true,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get quizzes by difficulty
const getQuizzesByDifficulty = async (req, res) => {
    try {
        const { difficulty } = req.params;

        const quizzes = await quizDiscoveryService.getQuizzesByDifficulty(difficulty);

        res.status(200).json({
            success: true,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Search quizzes by title
const searchQuizzesByTitle = async (req, res) => {

    try {

        const { title } = req.params;

        const quizzes = await quizDiscoveryService.searchQuizzesByTitle(title);

        res.status(200).json({
            success: true,
            data: quizzes
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
module.exports = {
    getAllQuizzes,
    getQuizById,
    getQuizzesByCategory,
    getQuizzesByDifficulty,
    searchQuizzesByTitle
};