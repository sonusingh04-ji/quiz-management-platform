const quizService = require("../services/quizService");

// ==========================================
// Create Quiz
// ==========================================
const createQuiz = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            difficulty,
            maxAttempts,
            passingScore,
            status,
            duration
        } = req.body;

        console.log("📥 CREATE QUIZ BODY:", req.body);
        console.log("👤 CREATE QUIZ USER:", req.user);

        const quiz = await quizService.createQuiz(
            title,
            description,
            req.user.id,
            category,
            difficulty,
            maxAttempts,
            passingScore,
            status,
            duration
        );

        res.status(201).json({
            success: true,
            message: "Quiz Created Successfully",
            data: quiz
        });

    } catch (error) {

        console.error("❌ CREATE QUIZ ERROR:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// Get All Quizzes
// ==========================================
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getAllQuizzes();

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


// ==========================================
// Get Quiz By ID
// ==========================================
const getQuizById = async (req, res) => {
    try {
        const quiz = await quizService.getQuizById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// Update Quiz
// ==========================================
const updateQuiz = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            difficulty,
            maxAttempts,
            passingScore
        } = req.body;

        const quiz = await quizService.updateQuiz(
            req.params.id,
            title,
            description,
            category,
            difficulty,
            maxAttempts,
            passingScore
        );

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Quiz Updated Successfully",
            data: quiz
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// Delete Quiz
// ==========================================
const deleteQuiz = async (req, res) => {
    try {
        const quiz = await quizService.deleteQuiz(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Quiz Deleted Successfully",
            data: quiz
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// Publish / Unpublish Quiz
// ==========================================
const updateQuizStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const quiz = await quizService.updateQuizStatus(
            req.params.id,
            status
        );

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        res.status(200).json({
            success: true,
            message: `Quiz ${status} successfully.`,
            data: quiz
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// ==========================================
// Get Published Quizzes
// ==========================================
const getPublishedQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getPublishedQuizzes();

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
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    updateQuizStatus,
    getPublishedQuizzes
};