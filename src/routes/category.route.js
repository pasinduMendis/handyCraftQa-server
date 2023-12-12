const express = require("express");
const authorize = require("../middleware/authorize.middleware");
const { categoryController } = require("../controllers/category.controller");
const router = express.Router();

router.post("/", authorize, categoryController.create);
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.get);
router.patch("/:id", authorize, categoryController.update);
router.delete("/:id", authorize, categoryController.remove);

module.exports = router;
