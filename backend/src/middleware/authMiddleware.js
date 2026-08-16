const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Authorization header missing
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access token required."
        });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization format."
        });
    }

    const token = authHeader.substring(7);

    // Token missing
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }

    // Verify JWT
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, user) => {

            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired token."
                });
            }

            req.user = user;

            next();
        }
    );
};

module.exports = {
    verifyToken
};