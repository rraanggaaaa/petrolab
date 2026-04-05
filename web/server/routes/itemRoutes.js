const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken } = require("../middleware/auth");
const { validateItem } = require("../middleware/validation");

router.use(authenticateToken);

router.get("/", itemController.getAllItems);
router.get("/categories", itemController.getCategories);
router.get("/:id", itemController.getItemById);
router.post("/", validateItem, itemController.createItem);
router.put("/:id", validateItem, itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
