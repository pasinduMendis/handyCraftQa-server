const express = require("express");
const authorize = require("../middleware/authorize.middleware");
const { productController } = require("../controllers/product.controller");
const router = express.Router();

/* var multer = require("multer");
const path = require("path");

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

const upload = multer({ storage: storage }); */

router.post("/", authorize, productController.create);
router.post(
  "/upload-images",
  authorize,
  // upload.fields([
  //   { name: "image1", maxCount: 1 },
  //   { name: "image2", maxCount: 1 },
  //   { name: "image3", maxCount: 1 },
  //   { name: "image4", maxCount: 1 },
  // ]),
  productController.uploadImages
);
router.get("/", productController.getAll);
router.get("/:id", productController.get);
router.patch("/:id", productController.update);
router.delete("/:id", authorize, productController.remove);

module.exports = router;
