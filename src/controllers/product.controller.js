const Business = require("../models/Business.model");
const ProductModel = require("../models/Product.model");
const { SuccessResponse, ErrorResponse } = require("../utils/response.util");

const get = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    return new SuccessResponse(res).ok({ product: product });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const query = req.query;
    const products = await ProductModel.find({ ...query });
    return new SuccessResponse(res).ok({
      products: products,
    });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const uploadImages = async (req, res) => {
  try {
    const imageCount = parseInt(req.body.count);

    const imageArray = [];
    for (let i = 1; i <= imageCount; i++) {
      const isMain = req.body[`isMain${i}`] === "true";
      const downloadUrl = `${req.protocol}://${req.get(
        "host"
      )}/product-images/${req.files[`image${i}`][0].filename}`;

      imageArray.push({
        src: downloadUrl,
        isMain: isMain,
      });
    }

    if (imageArray.length === 0) {
      return new ErrorResponse(res).badRequest("Images not uploaded");
    }
    return new SuccessResponse(res).created({ images: imageArray });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const create = async (req, res) => {
  try {
    const { id } = req.user;
    const business = await Business.findOne({ vendorId: id });
    const product = await ProductModel.create({
      ...req.body,
      business: business?._id,
    });
    return new SuccessResponse(res).created({ product: product });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const update = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return new SuccessResponse(res).created({ product: product });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const remove = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

module.exports = {
  productController: { get, getAll, create, update, remove, uploadImages },
};
