const quizRepository = require("../repositories/quizRepository");

// Create Quiz
const createQuiz = async (
    title,
    description,
    createdBy,
    category,
    difficulty,
    maxAttempts,
    passingScore,
    status,
    duration
) => {

    return await quizRepository.createQuiz(
        title,
        description,
        createdBy,
        category,
        difficulty,
        maxAttempts,
        passingScore,
        status,
        duration
    );
};


// ==========================================
// Get All Quizzes
// ==========================================
const getAllQuizzes = async () => {
    return await quizRepository.getAllQuizzes();
};


// ==========================================
// Get Quiz By ID
// ==========================================
const getQuizById = async (id) => {
    return await quizRepository.getQuizById(id);
};


// ==========================================
// Update Quiz
// ==========================================
const updateQuiz = async (
    id,
    title,
    description,
    category,
    difficulty,
    maxAttempts,
    passingScore
) => {
    return await quizRepository.updateQuiz(
        id,
        title,
        description,
        category,
        difficulty,
        maxAttempts,
        passingScore
    );
};


// ==========================================
// Delete Quiz
// ==========================================
const deleteQuiz = async (id) => {
    return await quizRepository.deleteQuiz(id);
};


// ==========================================
// Publish / Unpublish Quiz
// ==========================================
const updateQuizStatus = async (id, status) => {
    if (!["draft", "published"].includes(status)) {
        throw new Error(
            "Status must be either 'draft' or 'published'."
        );
    }

    return await quizRepository.updateQuizStatus(
        id,
        status
    );
};
// ==========================================
// Get Published Quizzes
// ==========================================
const getPublishedQuizzes = async () => {
    return await quizRepository.getPublishedQuizzes();
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    updateQuizStatus,
    getPublishedQuizzes
};