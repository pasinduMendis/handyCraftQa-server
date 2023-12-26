const authorize = require("../middleware/authorize.middleware");
const productController = require("../controllers/product.controller");
const validateBody = require("../middleware/validation.middleware");

var multer = require("multer");
const path = require("path");
const {
  validateCreate,
  validateUpdate,
} = require("../validation/product.schema");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "../../public/product-images");
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/product",
    authorize,
    validateBody(validateCreate),
    productController.create
  );
  app.post(
    "/product/upload-images",
    authorize,
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
    ]),
    productController.uploadImages
  );
  app.get("/product", productController.getAll);
  app.get("/product/:id", productController.get);
  app.patch(
    "/product/:id",
    authorize,
    validateBody(validateUpdate),
    productController.update
  );
  app.delete("/product/:id", authorize, productController.remove);
};
