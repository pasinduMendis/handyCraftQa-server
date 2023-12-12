const express = require("express");
const authorize = require("../middleware/authorize.middleware");
const { businessController } = require("../controllers/business.controller");
const router = express.Router();

router.post("/", authorize, businessController.create);
router.get("/", businessController.getAll);
router.patch("/", authorize, businessController.update);
router.get("/:id", businessController.get);
router.delete("/:id", authorize, businessController.remove);

module.exports = router;
