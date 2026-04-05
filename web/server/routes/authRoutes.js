const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/me", authenticateToken, authController.getCurrentUser);

module.exports = router;
