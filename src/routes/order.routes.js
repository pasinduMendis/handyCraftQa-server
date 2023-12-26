const authorize = require("../middleware/authorize.middleware");
const orderController = require("../controllers/order.controller");
const validateBody = require("../middleware/validation.middleware");
const { validateOrder } = require("../validation/order.schema");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/order",
    authorize,
    validateBody(validateOrder),
    orderController.create
  );
  app.get("/order", orderController.getAll);
  app.get("/order/:id", orderController.get);
  app.patch(
    "/order/:id",
    authorize,
    validateBody(validateOrder),
    orderController.update
  );
  app.delete("/order/:id", authorize, orderController.remove);
};
