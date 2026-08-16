const questionService =
    require("../services/questionService");


// =====================================================
// CREATE QUESTION
// POST /api/quizzes/:quizId/questions
// =====================================================
const createQuestion = async (req, res) => {

    try {

        const { quizId } = req.params;

        const {
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            explanation,
            marks,
            difficulty
        } = req.body;


        const newQuestion =
            await questionService.createQuestion(
                quizId,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                explanation,
                marks,
                difficulty
            );


        res.status(201).json({
            success: true,
            message: "Question Created Successfully",
            data: newQuestion
        });

    } catch (error) {

        console.error(
            "CREATE QUESTION ERROR:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET QUESTIONS BY QUIZ
// GET /api/quizzes/:quizId/questions
// =====================================================
const getQuestionsByQuiz = async (req, res) => {

    try {

        const { quizId } = req.params;

        const questions =
            await questionService.getQuestionsByQuizId(
                quizId
            );


        res.status(200).json({
            success: true,
            data: questions
        });

    } catch (error) {

        console.error(
            "GET QUESTIONS ERROR:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// UPDATE QUESTION
// PUT /api/quizzes/:quizId/questions/:id
// =====================================================
const updateQuestion = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            explanation,
            marks,
            difficulty
        } = req.body;


        const updatedQuestion =
            await questionService.updateQuestion(
                id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                explanation,
                marks,
                difficulty
            );


        if (!updatedQuestion) {

            return res.status(404).json({
                success: false,
                message: "Question not found."
            });
        }


        res.status(200).json({
            success: true,
            message: "Question Updated Successfully",
            data: updatedQuestion
        });

    } catch (error) {

        console.error(
            "UPDATE QUESTION ERROR:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// DELETE QUESTION
// DELETE /api/quizzes/:quizId/questions/:id
// =====================================================
const deleteQuestion = async (req, res) => {

    try {

        const { id } = req.params;

        const deletedQuestion =
            await questionService.deleteQuestion(id);


        if (!deletedQuestion) {

            return res.status(404).json({
                success: false,
                message: "Question not found."
            });
        }


        res.status(200).json({
            success: true,
            message: "Question Deleted Successfully",
            data: deletedQuestion
        });

    } catch (error) {

        console.error(
            "DELETE QUESTION ERROR:",
            error
        );


        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion
};