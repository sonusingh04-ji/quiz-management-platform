const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const quizDiscoveryRoutes = require("./routes/quizDiscoveryRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();


// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Security headers
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173"
    })
);

// Limit JSON request body size
app.use(express.json({ limit: "100kb" }));


// ==========================================
// RATE LIMITING
// ==========================================

// General API rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);


// Authentication rate limit
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    }
});

app.use("/api/auth", authLimiter);


// ==========================================
// ROUTES
// ==========================================

// Question routes must come BEFORE quizRoutes
app.use("/api/users", userRoutes);

app.use("/api/quizzes", questionRoutes);
app.use("/api/quizzes", quizRoutes);

app.use("/api/attempts", attemptRoutes);
app.use("/api/results", resultRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/student", studentDashboardRoutes);

app.use("/api/discovery", quizDiscoveryRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/admin/analytics", analyticsRoutes);

app.use("/api/admin/reports", reportRoutes);


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.status(200).send(
        "🚀 Quiz Management Platform Backend is Running..."
    );
});


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error("Server Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error."
                : err.message
    });
});


module.exports = app;