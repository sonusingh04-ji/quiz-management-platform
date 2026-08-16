const resultRepository = require("../repositories/resultRepository");

// Save Result
const saveResult = async (
    user_id,
    quiz_id,
    attempt_id,
    total_questions,
    correct_answers,
    wrong_answers,
    percentage
) => {

    if (
        !user_id ||
        !quiz_id ||
        !attempt_id ||
        total_questions == null ||
        correct_answers == null ||
        wrong_answers == null ||
        percentage == null
    ) {
        throw new Error("All fields are required.");
    }

    return await resultRepository.saveResult(
        user_id,
        quiz_id,
        attempt_id,
        total_questions,
        correct_answers,
        wrong_answers,
        percentage
    );
};

// Get All Results
const getAllResults = async () => {
    return await resultRepository.getAllResults();
};

// Get Result By ID
const getResultById = async (id) => {

    const result = await resultRepository.getResultById(id);

    if (!result) {
        throw new Error("Result not found.");
    }

    return result;
};

// Get Results By User
const getResultsByUser = async (userId) => {
    return await resultRepository.getResultsByUser(userId);
};

// Delete Result
const deleteResult = async (id) => {

    const result = await resultRepository.deleteResult(id);

    if (!result) {
        throw new Error("Result not found.");
    }

    return result;
};

module.exports = {
    saveResult,
    getAllResults,
    getResultById,
    getResultsByUser,
    deleteResult
};