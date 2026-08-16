const questionRepository =
    require("../repositories/questionRepository");


// =====================================================
// CREATE QUESTION
// =====================================================
const createQuestion = async (
    quizId,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    explanation,
    marks,
    difficulty
) => {

    // -----------------------------
    // Required field validation
    // -----------------------------
    if (!quizId) {
        throw new Error("Quiz ID is required.");
    }

    if (!question || !question.trim()) {
        throw new Error("Question text is required.");
    }

    if (!optionA || !optionA.trim()) {
        throw new Error("Option A is required.");
    }

    if (!optionB || !optionB.trim()) {
        throw new Error("Option B is required.");
    }

    if (!optionC || !optionC.trim()) {
        throw new Error("Option C is required.");
    }

    if (!optionD || !optionD.trim()) {
        throw new Error("Option D is required.");
    }

    // -----------------------------
    // Correct answer validation
    // -----------------------------
    const allowedAnswers = ["A", "B", "C", "D"];

    const normalizedAnswer =
        String(correctAnswer || "").toUpperCase();

    if (!allowedAnswers.includes(normalizedAnswer)) {
        throw new Error(
            "Correct answer must be A, B, C, or D."
        );
    }

    // -----------------------------
    // Marks validation
    // -----------------------------
    const questionMarks =
        Number(marks ?? 1);

    if (
        Number.isNaN(questionMarks) ||
        questionMarks <= 0
    ) {
        throw new Error(
            "Marks must be greater than 0."
        );
    }

    // -----------------------------
    // Difficulty validation
    // -----------------------------
    const allowedDifficulties = [
        "Easy",
        "Medium",
        "Hard"
    ];

    const questionDifficulty =
        difficulty || "Medium";

    if (
        !allowedDifficulties.includes(
            questionDifficulty
        )
    ) {
        throw new Error(
            "Difficulty must be Easy, Medium, or Hard."
        );
    }

    return await questionRepository.createQuestion(
        quizId,
        question.trim(),
        optionA.trim(),
        optionB.trim(),
        optionC.trim(),
        optionD.trim(),
        normalizedAnswer,
        explanation?.trim() || null,
        questionMarks,
        questionDifficulty
    );
};


// =====================================================
// GET QUESTIONS BY QUIZ
// =====================================================
const getQuestionsByQuizId = async (quizId) => {

    if (!quizId) {
        throw new Error("Quiz ID is required.");
    }

    return await questionRepository.getQuestionsByQuizId(
        quizId
    );
};


// =====================================================
// UPDATE QUESTION
// =====================================================
const updateQuestion = async (
    id,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    explanation,
    marks,
    difficulty
) => {

    if (!id) {
        throw new Error("Question ID is required.");
    }

    if (!question || !question.trim()) {
        throw new Error("Question text is required.");
    }

    if (!optionA || !optionA.trim()) {
        throw new Error("Option A is required.");
    }

    if (!optionB || !optionB.trim()) {
        throw new Error("Option B is required.");
    }

    if (!optionC || !optionC.trim()) {
        throw new Error("Option C is required.");
    }

    if (!optionD || !optionD.trim()) {
        throw new Error("Option D is required.");
    }

    const normalizedAnswer =
        String(correctAnswer || "").toUpperCase();

    if (!["A", "B", "C", "D"].includes(normalizedAnswer)) {
        throw new Error(
            "Correct answer must be A, B, C, or D."
        );
    }

    const questionMarks =
        Number(marks ?? 1);

    if (
        Number.isNaN(questionMarks) ||
        questionMarks <= 0
    ) {
        throw new Error(
            "Marks must be greater than 0."
        );
    }

    const questionDifficulty =
        difficulty || "Medium";

    if (
        !["Easy", "Medium", "Hard"].includes(
            questionDifficulty
        )
    ) {
        throw new Error(
            "Difficulty must be Easy, Medium, or Hard."
        );
    }

    return await questionRepository.updateQuestion(
        id,
        question.trim(),
        optionA.trim(),
        optionB.trim(),
        optionC.trim(),
        optionD.trim(),
        normalizedAnswer,
        explanation?.trim() || null,
        questionMarks,
        questionDifficulty
    );
};


// =====================================================
// DELETE QUESTION
// =====================================================
const deleteQuestion = async (id) => {

    if (!id) {
        throw new Error("Question ID is required.");
    }

    return await questionRepository.deleteQuestion(id);
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    createQuestion,
    getQuestionsByQuizId,
    updateQuestion,
    deleteQuestion
};