const authService = require("../services/authService");

// Register
const register = async (req, res) => {

    try {

        const {
            fullName,
            email,
            password,
            role,
            adminCode
        } = req.body;
        const result =
            await authService.register(
                fullName,
                email,
                password,
                role,
                adminCode
            );

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: result.user
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};
// Login
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token: result.token,
            user: result.user
        });

    } catch (error) {

        res.status(401).json({
            success: false,
            message: error.message
        });

    }

};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await authService.forgotPassword(email);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const result = await authService.resetPassword(
            token,
            newPassword
        );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};