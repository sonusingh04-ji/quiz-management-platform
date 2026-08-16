const analyticsService = require("../services/analyticsService");

// Get Quiz Analytics
const getAnalytics = async (req, res) => {

    try {

        const analytics =
            await analyticsService.getAnalytics();

        res.status(200).json({
            success: true,
            message: "Quiz analytics fetched successfully",
            data: analytics
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getAnalytics
};