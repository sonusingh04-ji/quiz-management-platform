const reportRepository =
    require("../repositories/reportRepository");


// =====================================================
// Get All Attempt Reports
// =====================================================
const getAttemptReport = async () => {

    return await reportRepository.getAttemptReport();

};


// =====================================================
// Get All User Reports
// =====================================================
const getUserReport = async () => {

    return await reportRepository.getUserReport();

};


// =====================================================
// Get All Quiz Reports
// =====================================================
const getQuizReport = async () => {

    return await reportRepository.getQuizReport();

};


// =====================================================
// Get Student Attempt Report
// =====================================================
const getStudentAttemptReport = async (
    attemptId,
    userId
) => {

    // Get attempt summary
    const attempt =
        await reportRepository.getStudentAttemptDetails(
            attemptId,
            userId
        );

    if (!attempt) {
        throw new Error(
            "Attempt not found."
        );
    }


    // Get question-level details
    const questions =
        await reportRepository.getAttemptQuestionReport(
            attemptId
        );


    return {
        attempt,
        questions
    };

};


// =====================================================
// Export User Report
// =====================================================
const exportUserReport = async () => {

    return await reportRepository.exportUserReport();

};


// =====================================================
// Export Quiz Report
// =====================================================
const exportQuizReport = async () => {

    return await reportRepository.exportQuizReport();

};
// =====================================================
// Get User Performance
// Admin
// =====================================================
const getUserPerformance = async (userId) => {

    const report =
        await reportRepository.getUserPerformance(
            userId
        );

    if (!report) {
        throw new Error("User not found.");
    }

    return report;
};

// =====================================================
// Export
// =====================================================
module.exports = {

    getAttemptReport,

    getUserReport,

    getQuizReport,

    getStudentAttemptReport,

    exportUserReport,

    exportQuizReport,
    getUserPerformance

};