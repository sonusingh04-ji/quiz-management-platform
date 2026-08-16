const adminRepository = require("../repositories/adminRepository");

// Get Dashboard Statistics
const getDashboardStats = async () => {

    const stats = await adminRepository.getDashboardStats();

    return stats;
};


// Get All Users
const getAllUsers = async () => {

    const users = await adminRepository.getAllUsers();

    return users;
};
// Update User Active Status
const updateUserStatus = async (userId, isActive) => {

    const user = await adminRepository.updateUserStatus(
        userId,
        isActive
    );

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};
// Get Single User
const getUserById = async (userId) => {

    const user = await adminRepository.getUserById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};


// Delete User
const deleteUser = async (userId) => {

    const user = await adminRepository.deleteUser(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};
// Get Quiz Attempts Over Time
const getAttemptsOverTime = async () => {

    return await adminRepository.getAttemptsOverTime();

};


// Get Student Registrations
const getStudentRegistrations = async () => {

    return await adminRepository.getStudentRegistrations();

};


// Get Average Quiz Scores
const getAverageScores = async () => {

    return await adminRepository.getAverageScores();

};
// Get Popular Categories
const getPopularCategories = async () => {

    return await adminRepository.getPopularCategories();

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