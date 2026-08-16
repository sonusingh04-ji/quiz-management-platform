const quizDiscoveryRepository = require("../repositories/quizDiscoveryRepository");

// Get all quizzes
const getAllQuizzes = async () => {
    return await quizDiscoveryRepository.getAllQuizzes();
};

// Get quiz by ID
const getQuizById = async (id) => {

    const quiz = await quizDiscoveryRepository.getQuizById(id);

    if (!quiz) {
        throw new Error("Quiz not found.");
    }

    return quiz;
};

// Get quizzes by category
const getQuizzesByCategory = async (category) => {
    return await quizDiscoveryRepository.getQuizzesByCategory(category);
};

// Get quizzes by difficulty
const getQuizzesByDifficulty = async (difficulty) => {
    return await quizDiscoveryRepository.getQuizzesByDifficulty(difficulty);
};
// Search quizzes by title
const searchQuizzesByTitle = async (title) => {
    return await quizDiscoveryRepository.searchQuizzesByTitle(title);
};
module.exports = {
    getAllQuizzes,
    getQuizById,
    getQuizzesByCategory,
    getQuizzesByDifficulty,
    searchQuizzesByTitle
};