const express = require("express");
const { vendorController } = require("../controllers/vendor.controller");
const authorize = require("../middleware/authorize.middleware");
const router = express.Router();

router.get("/", vendorController.getAll);
router.get("/:id", vendorController.get);
router.delete("/", authorize, vendorController.remove);
router.patch("/", authorize, vendorController.update);
router.post("/auth/basicRegistration", vendorController.basicRegistration);
router.post(
  "/auth/advancedRegistration",
  authorize,
  vendorController.advancedRegistration
);
router.post("/auth/verify", vendorController.verifyEmail);
router.post("/auth/reqVerify", vendorController.reqVerificationEmail);
router.post("/auth/login", vendorController.login);

module.exports = router;
