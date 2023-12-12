const express = require("express");
const { userController } = require("../controllers/user.controller");
const authorize = require("../middleware/authorize.middleware");
const router = express.Router();

router.get("/", userController.getAll);
router.get("/:id", userController.get);
router.delete("/", authorize, userController.remove);
router.patch("/", authorize, userController.update);
router.post("/auth/registration", userController.register);
router.post("/auth/verify", userController.verifyEmail);
router.post("/auth/reqVerify", userController.reqVerificationEmail);
router.post("/auth/login", userController.login);

module.exports = router;
