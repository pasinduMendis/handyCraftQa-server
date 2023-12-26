const authorize = require("../middleware/authorize.middleware");
const userController = require("../controllers/user.controller");
const validateBody = require("../middleware/validation.middleware");
const {
  validateUpdate,
  validateRegister,
  validateLogin,
} = require("../validation/user.schema");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/user", userController.getAll);
  app.get("/user/:id", userController.get);
  app.delete("/user/:id", authorize, userController.remove);
  app.patch(
    "/user/:id",
    authorize,
    validateBody(validateUpdate),
    userController.update
  );
  app.post(
    "/user/auth/registration",
    validateBody(validateRegister),
    userController.register
  );
  app.post("/user/auth/verify", userController.verifyEmail);
  app.post("/user/auth/reqVerify", userController.reqVerificationEmail);
  app.post(
    "/user/auth/login",
    validateBody(validateLogin),
    userController.login
  );
};
