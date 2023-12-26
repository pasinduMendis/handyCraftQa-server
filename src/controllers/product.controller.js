const Business = require("../models/Business.model");
const Product = require("../models/Product.model");
const { SuccessResponse, ErrorResponse } = require("../utils/response.utils");

const get = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return new SuccessResponse(res).ok({ product: product });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const products = await Product.find({ ...req.query });
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
    const business = await Business.findOne({ vendorId: req.user.id });
    const product = await Product.create({
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return new SuccessResponse(res).created({ product: product });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const remove = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

module.exports = { get, getAll, create, update, remove, uploadImages };
