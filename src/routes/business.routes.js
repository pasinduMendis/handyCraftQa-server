const authorize = require("../middleware/authorize.middleware");
const businessController = require("../controllers/business.controller");
const validateBody = require("../middleware/validation.middleware");
const {
  validateRegister,
  validateUpdate,
} = require("../validation/business.schema");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/business",
    authorize,
    validateBody(validateRegister),
    businessController.create
  );
  app.get("/business", businessController.getAll);
  app.get("/business/:id", businessController.get);
  app.patch(
    "/business/:id",
    authorize,
    validateBody(validateUpdate),
    businessController.update
  );
  app.delete("/business/:id", authorize, businessController.remove);
};
