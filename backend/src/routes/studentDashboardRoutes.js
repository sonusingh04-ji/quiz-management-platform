const express = require("express");
const router = express.Router();

const studentDashboardController = require("../controllers/studentDashboardController");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("student"),
    studentDashboardController.getStudentDashboard
);

module.exports = router;