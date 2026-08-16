    const attemptRepository =
        require("../repositories/attemptRepository");

    // =====================================================
    // START QUIZ
    // =====================================================
    const startQuiz = async (userId, quizId) => {

        // Get Quiz
        const quiz =
            await attemptRepository.getQuizById(quizId);

        if (!quiz) {
            throw new Error("Quiz not found");
        }

        // Check Maximum Attempts
        const attemptCount =
            await attemptRepository.getAttemptCount(
                userId,
                quizId
            );

        if (attemptCount >= quiz.max_attempts) {
            throw new Error(
                "Maximum attempts reached for this quiz."
            );
        }

        // Check Existing Active Attempt
        let activeAttempt =
            await attemptRepository.getActiveAttempt(
                userId,
                quizId
            );

        // Create Attempt If No Active Attempt
        if (!activeAttempt) {

            activeAttempt =
                await attemptRepository.createAttempt(
                    userId,
                    quizId
                );
        }

        // Get Questions
        const questions =
            await attemptRepository.getQuestionsByQuizId(
                quizId
            );

        if (!questions.length) {
            throw new Error(
                "No questions found for this quiz."
            );
        }

        // Hide Correct Answer and Explanation
        const safeQuestions =
            questions.map(
                ({
                     correct_answer,
                     explanation,
                     ...question
                 }) => question
            );

        return {
            attemptId: activeAttempt.id,
            quiz,
            questions: safeQuestions
        };
    };


    // =====================================================
    // SUBMIT QUIZ
    // =====================================================
    const submitQuiz = async (
        userId,
        quizId,
        answers
    ) => {

        // Validate Answers
        if (!Array.isArray(answers)) {
            throw new Error(
                "Answers must be an array."
            );
        }

        // Get Active Attempt
        const activeAttempt =
            await attemptRepository.getActiveAttempt(
                userId,
                quizId
            );

        if (!activeAttempt) {
            throw new Error(
                "No active quiz attempt found."
            );
        }

        // Get Questions
        const questions =
            await attemptRepository.getQuestionsByQuizId(
                quizId
            );

        if (!questions.length) {
            throw new Error(
                "No questions found for this quiz."
            );
        }

        // Get Quiz
        const quiz =
            await attemptRepository.getQuizById(
                quizId
            );

        if (!quiz) {
            throw new Error("Quiz not found");
        }


        // =================================================
        // OPTION MAP
        // =================================================

        const optionMap = {
            option_a: "A",
            option_b: "B",
            option_c: "C",
            option_d: "D"
        };


        // =================================================
        // CHECK ANSWERS
        // =================================================

        let correctAnswers = 0;
        let unanswered = 0;

        for (const question of questions) {

            const userAnswer =
                answers.find(
                    answer =>
                        Number(answer.questionId) ===
                        Number(question.id)
                );


            // Convert option_a -> A
            const selectedAnswer =
                userAnswer &&
                optionMap[userAnswer.selectedOption]
                    ? optionMap[userAnswer.selectedOption]
                    : null;


            // If no valid answer was submitted
            if (selectedAnswer === null) {
                unanswered++;
            }


            // Check Correct Answer
            const isCorrect =
                selectedAnswer !== null &&
                selectedAnswer ===
                question.correct_answer;


            if (isCorrect) {
                correctAnswers++;
            }


            // Save Student Answer
            await attemptRepository.saveAnswer(
                activeAttempt.id,
                question.id,
                selectedAnswer,
                isCorrect
            );
        }


        // =================================================
        // CALCULATE RESULT
        // =================================================

        const totalQuestions =
            questions.length;


        const wrongAnswers =
            totalQuestions -
            correctAnswers -
            unanswered;


        const percentage =
            Number(
                (
                    (correctAnswers /
                        totalQuestions) *
                    100
                ).toFixed(2)
            );


        // =================================================
        // CALCULATE TIME TAKEN
        // =================================================

        const startedAt =
            new Date(
                activeAttempt.started_at
            );

        const submittedAt =
            new Date();


        const timeTaken =
            Math.max(
                0,
                Math.floor(
                    (
                        submittedAt.getTime() -
                        startedAt.getTime()
                    ) / 1000
                )
            );


        // =================================================
        // DETERMINE PASS / FAIL
        // =================================================

        const status =
            percentage >=
            Number(quiz.passing_score)
                ? "PASSED"
                : "FAILED";


        // =================================================
        // SAVE RESULT
        // =================================================
        console.log("RESULT DATA:", {
            userId,
            quizId,
            attemptId: activeAttempt.id,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            unanswered,
            percentage
        });
        const result =
            await attemptRepository.saveResult(
                userId,
                quizId,
                activeAttempt.id,
                totalQuestions,
                correctAnswers,
                wrongAnswers,
                percentage
            );


        // =================================================
        // UPDATE ATTEMPT
        // =================================================

        const submittedAttempt =
            await attemptRepository.submitAttempt(
                activeAttempt.id,
                percentage,
                totalQuestions,
                correctAnswers,
                wrongAnswers,
                unanswered,
                timeTaken,
                status
            );


        // =================================================
        // RETURN RESULT
        // =================================================

        return {
            result,
            attempt: submittedAttempt
        };
    };


    // =====================================================
    // QUIZ HISTORY
    // =====================================================
    const getQuizHistory = async (
        userId,
        page = 1,
        limit = 10
    ) => {

        return await attemptRepository.getQuizHistory(
            userId,
            page,
            limit
        );
    };


    // =====================================================
    // ATTEMPT DETAILS
    // =====================================================
    const getAttemptDetails = async (
        userId,
        attemptId
    ) => {

        // Get Attempt Summary
        const attempt =
            await attemptRepository.getAttemptById(
                attemptId,
                userId
            );

        if (!attempt) {
            throw new Error(
                "Attempt not found."
            );
        }


        // Get Answers
        const answers =
            await attemptRepository.getAttemptAnswers(
                attemptId
            );


        return {
            attempt,
            answers
        };
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