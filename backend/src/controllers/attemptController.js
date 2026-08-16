const attemptService =
    require("../services/attemptService");


// =====================================================
// START QUIZ
// =====================================================
const startQuiz = async (req, res) => {

    try {

        const userId = req.user.id;

        const { quizId } =
            req.params;


        const data =
            await attemptService.startQuiz(
                userId,
                quizId
            );


        res.status(200).json({
            success: true,
            message: "Quiz started successfully",
            data
        });

    } catch (error) {

        console.error(
            "Start Quiz Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// SUBMIT QUIZ
// =====================================================
const submitQuiz = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const {
            quizId,
            answers
        } = req.body;


        if (!quizId) {

            return res.status(400).json({
                success: false,
                message: "quizId is required"
            });
        }


        const result =
            await attemptService.submitQuiz(
                userId,
                quizId,
                answers
            );


        res.status(200).json({
            success: true,
            message: "Quiz submitted successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Submit Quiz Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// QUIZ HISTORY
// =====================================================
const getQuizHistory = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const page =
            Math.max(
                Number(req.query.page) || 1,
                1
            );

        const limit =
            Math.min(
                Math.max(
                    Number(req.query.limit) || 10,
                    1
                ),
                100
            );


        const history =
            await attemptService.getQuizHistory(
                userId,
                page,
                limit
            );
        res.status(200).json({

            success: true,
            message:
                "Quiz history fetched successfully",
            page: history.page,
            limit:
            history.limit,
            total:
            history.total,
            totalPages:
                Math.ceil(
                    history.total /
                    history.limit
                ),

            data:
            history.history
        });

    } catch (error) {

        console.error(
            "Quiz History Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// ATTEMPT DETAILS
// =====================================================
const getAttemptDetails = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;


        const { attemptId } =
            req.params;


        const data =
            await attemptService.getAttemptDetails(
                userId,
                attemptId
            );


        res.status(200).json({
            success: true,
            message:
                "Attempt details fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Attempt Details Error:",
            error
        );

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    startQuiz,
    submitQuiz,
    getQuizHistory,
    getAttemptDetails
};