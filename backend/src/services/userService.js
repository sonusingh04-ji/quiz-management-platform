const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

// Register User
const registerUser = async (fullName, email, password, role = "student") => {

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await userRepository.createUser(
        fullName,
        email,
        hashedPassword,
        role
    );
};

// Login User
const loginUser = async (email, password) => {

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid Email or Password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid Email or Password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
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

module.exports = {
    registerUser,
    loginUser
};