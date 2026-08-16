const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/// Register
const register = async (
    fullName,
    email,
    password,
    role = "student",
    adminCode
) => {

    // Validate required fields
    if (!fullName || !email || !password) {
        throw new Error(
            "Full name, email and password are required."
        );
    }

    // Normalize role
    role = role.toLowerCase();

    // Only allow valid roles during registration
    if (role !== "student" && role !== "admin") {
        throw new Error("Invalid registration role.");
    }

    // Admin registration protection
    if (role === "admin") {

        if (!adminCode) {
            throw new Error(
                "Admin registration code is required."
            );
        }

        if (
            adminCode !==
            process.env.ADMIN_REGISTRATION_CODE
        ) {
            throw new Error(
                "Invalid admin registration code."
            );
        }
    }

    // Check existing user
    const existingUser =
        await authRepository.findUserByEmail(email);

    if (existingUser) {
        throw new Error(
            "User with this email already exists."
        );
    }

    // Password validation
    if (password.length < 6) {
        throw new Error(
            "Password must be at least 6 characters long."
        );
    }

    // Hash password
    const hashedPassword =
        await bcrypt.hash(password, 10);

    // Create account
    const user =
        await authRepository.createUser(
            fullName,
            email,
            hashedPassword,
            role
        );

    return {
        user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        }
    };
};
const login = async (email, password) => {

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return {
        token,
        user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        }
    };
};
// Forgot Password
const forgotPassword = async (email) => {

    // Find User
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("User not found.");
    }

    // Generate Secure Token
    const resetToken = crypto
        .randomBytes(32)
        .toString("hex");

    // Expiry = 15 Minutes
    const expiry = new Date(
        Date.now() + 15 * 60 * 1000
    );

    // Save Token
    await authRepository.saveResetToken(
        user.id,
        resetToken,
        expiry
    );

    return {
        message: "Password reset token generated successfully.",
        resetToken
    };
};
// Reset Password
const resetPassword = async (
    token,
    newPassword
) => {

    // Verify Token
    const user =
        await authRepository.getUserByResetToken(
            token
        );

    if (!user) {
        throw new Error(
            "Invalid or expired reset token."
        );
    }

    // Hash Password
    const hashedPassword =
        await bcrypt.hash(newPassword, 10);

    // Update Password
    await authRepository.updatePassword(
        user.id,
        hashedPassword
    );

    return {
        message: "Password reset successful."
    };
};
module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};