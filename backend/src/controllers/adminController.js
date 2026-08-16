const adminService = require("../services/adminService");

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {

    try {

        const stats = await adminService.getDashboardStats();

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Get All Users
const getAllUsers = async (req, res) => {

    try {

        const users = await adminService.getAllUsers();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Update User Active Status
const updateUserStatus = async (req, res) => {

    try {

        const userId = req.params.id;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean."
            });
        }

        const user = await adminService.updateUserStatus(
            userId,
            isActive
        );

        res.status(200).json({
            success: true,
            message: isActive
                ? "User activated successfully."
                : "User deactivated successfully.",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Get Single User
const getUserById = async (req, res) => {

    try {

        const userId = req.params.id;

        const user = await adminService.getUserById(userId);

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });

    } catch (error) {

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


// Delete User
const deleteUser = async (req, res) => {

    try {

        const userId = req.params.id;

        const user = await adminService.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        });

    } catch (error) {

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
// Get Quiz Attempts Over Time
const getAttemptsOverTime = async (req, res) => {

    try {

        const data =
            await adminService.getAttemptsOverTime();

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Get Student Registrations
const getStudentRegistrations = async (req, res) => {

    try {

        const data =
            await adminService.getStudentRegistrations();

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Get Average Quiz Scores
const getAverageScores = async (req, res) => {

    try {

        const data =
            await adminService.getAverageScores();

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Get Popular Categories
const getPopularCategories = async (req, res) => {

    try {

        const data =
            await adminService.getPopularCategories();

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getUserById,
    deleteUser,
    getStudentRegistrations,
    getAverageScores,
    getPopularCategories,
    getAttemptsOverTime
};