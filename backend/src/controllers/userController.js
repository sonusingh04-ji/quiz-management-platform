const userService = require("../services/userService");

// Register User
const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        const user = await userService.registerUser(
            fullName,
            email,
            password,
            role
        );

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login User
// Login User
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await userService.loginUser(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};
const getProfile = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user
    });

};

module.exports = {
    register,
    login,
    getProfile
};