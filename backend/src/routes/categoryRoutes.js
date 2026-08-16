const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public Routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin Only Routes
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    categoryController.createCategory
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    categoryController.updateCategory
);

router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    categoryController.deleteCategory
);

module.exports = router;