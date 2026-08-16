const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analyticsController");

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Quiz Analytics
router.get(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    analyticsController.getAnalytics
);

module.exports = router;