const reportService =
    require("../services/reportService");


// =====================================================
// Get All Attempt Reports
// Admin
// =====================================================
const getAttemptReport = async (req, res) => {

    try {

        const reports =
            await reportService.getAttemptReport();

        res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {

        console.error(
            "Get Attempt Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Get User Report
// Admin
// =====================================================
const getUserReport = async (req, res) => {

    try {

        const reports =
            await reportService.getUserReport();

        res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {

        console.error(
            "Get User Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Get Quiz Report
// Admin
// =====================================================
const getQuizReport = async (req, res) => {

    try {

        const reports =
            await reportService.getQuizReport();

        res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {

        console.error(
            "Get Quiz Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Get Student Attempt Report
// Student / Owner
// =====================================================
const getStudentAttemptReport = async (
    req,
    res
) => {

    try {

        const { attemptId } = req.params;

        const userId = req.user.id;

        const report =
            await reportService.getStudentAttemptReport(
                attemptId,
                userId
            );

        res.status(200).json({
            success: true,
            message:
                "Student attempt report fetched successfully.",
            data: report
        });

    } catch (error) {

        console.error(
            "Get Student Attempt Report Error:",
            error
        );

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Export User Report
// =====================================================
const exportUserReport = async (req, res) => {

    try {

        const report =
            await reportService.exportUserReport();

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        console.error(
            "Export User Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Export Quiz Report
// =====================================================
const exportQuizReport = async (req, res) => {

    try {

        const report =
            await reportService.exportQuizReport();

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        console.error(
            "Export Quiz Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================================
// Get User Performance
// Admin
// =====================================================
const getUserPerformance = async (req, res) => {

    try {

        const { userId } = req.params;

        const report =
            await reportService.getUserPerformance(
                userId
            );

        res.status(200).json({
            success: true,
            message:
                "User performance fetched successfully.",
            data: report
        });

    } catch (error) {

        console.error(
            "Get User Performance Error:",
            error
        );

        if (error.message === "User not found.") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
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