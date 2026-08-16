const express = require("express");

const router = express.Router();

const reportController =
    require("../controllers/reportController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");


// =====================================================
// ADMIN REPORTS
// =====================================================

// All completed attempts
router.get(
    "/attempts",
    verifyToken,
    authorizeRoles("admin"),
    reportController.getAttemptReport
);


// Student/User performance report
router.get(
    "/users",
    verifyToken,
    authorizeRoles("admin"),
    reportController.getUserReport
);


// Quiz performance report
router.get(
    "/quizzes",
    verifyToken,
    authorizeRoles("admin"),
    reportController.getQuizReport
);


// Export user report data
router.get(
    "/export/users",
    verifyToken,
    authorizeRoles("admin"),
    reportController.exportUserReport
);


// Export quiz report data
router.get(
    "/export/quizzes",
    verifyToken,
    authorizeRoles("admin"),
    reportController.exportQuizReport
);
// =====================================================
// USER PERFORMANCE
// =====================================================

router.get(
    "/users/:userId/performance",
    verifyToken,
    authorizeRoles("admin"),
    reportController.getUserPerformance
);

// =====================================================
// STUDENT REPORT
// =====================================================

// Get student's own attempt report
router.get(
    "/attempt/:attemptId",
    verifyToken,
    reportController.getStudentAttemptReport
);


module.exports = router;