const authorize = require("../middleware/authorize.middleware");
const categoryController = require("../controllers/category.controller");
const validateBody = require("../middleware/validation.middleware");
const { validateCategory } = require("../validation/category.schema");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/category",
    authorize,
    validateBody(validateCategory),
    categoryController.create
  );
  app.get("/category", categoryController.getAll);
  app.get("/category/:id", categoryController.get);
  app.patch(
    "/category/:id",
    authorize,
    validateBody(validateCategory),
    categoryController.update
  );
  app.delete("/category/:id", authorize, categoryController.remove);
};
