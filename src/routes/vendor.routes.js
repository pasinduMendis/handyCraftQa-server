const authorize = require("../middleware/authorize.middleware");
const vendorController = require("../controllers/vendor.controller");
const validateBody = require("../middleware/validation.middleware");
const {
  validateUpdate,
  validateBasicRegistration,
  validateAdvancedRegistration,
  validateLogin,
} = require("../validation/vendor.schema");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/vendor", vendorController.getAll);
  app.get("/vendor/:id", vendorController.get);
  app.delete("/vendor/:id", authorize, vendorController.remove);
  app.patch(
    "/vendor/:id",
    authorize,
    validateBody(validateUpdate),
    vendorController.update
  );
  app.post(
    "/vendor/auth/basicRegistration",
    validateBody(validateBasicRegistration),
    vendorController.basicRegistration
  );
  app.post(
    "/vendor/auth/advancedRegistration/:id",
    authorize,
    validateBody(validateAdvancedRegistration),
    vendorController.advancedRegistration
  );
  app.post("/vendor/auth/verify", vendorController.verifyEmail);
  app.post("/vendor/auth/reqVerify", vendorController.reqVerificationEmail);
  app.post(
    "/vendor/auth/login",
    validateBody(validateLogin),
    vendorController.login
  );
};
