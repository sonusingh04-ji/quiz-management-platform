const studentDashboardService = require("../services/studentDashboardService");

// Get Student Dashboard
const getStudentDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const dashboard = await studentDashboardService.getStudentDashboard(userId);

        res.status(200).json({
            success: true,
            message: "Student Dashboard fetched successfully",
            data: dashboard
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getStudentDashboard
};