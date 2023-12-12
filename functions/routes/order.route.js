const express = require("express");
const authorize = require("../middleware/authorize.middleware");
const { orderController } = require("../controllers/order.controller");
const router = express.Router();

router.post("/", authorize, orderController.create);
router.get("/", orderController.getAll);
router.get("/:id", orderController.get);
router.patch("/:id", authorize, orderController.update);
router.delete("/:id", authorize, orderController.remove);

module.exports = router;