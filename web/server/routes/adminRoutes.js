const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeAdmin);

// User management routes
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id/role", userController.updateUserRole);

module.exports = router;
