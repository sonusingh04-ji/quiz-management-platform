const express = require("express");

const router = express.Router();

const resultController =
    require("../controllers/resultController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");
// =====================================================
// SAVE RESULT
// =====================================================
// Normally your attemptService already saves the result
// when the quiz is submitted.
//
// Keeping this endpoint for now.
// Student only.
// =====================================================
router.post(
    "/",
    verifyToken,
    authorizeRoles("student"),
    resultController.saveResult
);
// =====================================================
// GET ALL RESULTS
// =====================================================
// Admin only
// =====================================================

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    resultController.getAllResults
);
// =====================================================
// GET MY RESULTS
// =====================================================
// Student can only access their own results.
//
// IMPORTANT:
// The user ID comes from JWT, not from the URL.
// =====================================================

router.get(
    "/my-results",
    verifyToken,
    authorizeRoles("student"),
    resultController.getMyResults
);
// =====================================================
// GET RESULT BY ID
// =====================================================
// We will make the controller verify that the result
// belongs to the logged-in student, unless the requester
// is an admin.
// =====================================================

router.get(
    "/:id",
    verifyToken,
    resultController.getResultById
);
// =====================================================
// DELETE RESULT
// =====================================================
// Admin only
// =====================================================
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    resultController.deleteResult
);
module.exports = router;