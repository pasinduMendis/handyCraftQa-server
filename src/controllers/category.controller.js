const Category = require("../models/Category.model");
const { SuccessResponse, ErrorResponse } = require("../utils/response.utils");

const get = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    return new SuccessResponse(res).ok({ category: category });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await Category.find();
    return new SuccessResponse(res).ok({
      categories: categories,
    });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const create = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return new SuccessResponse(res).created({ category: category });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return new SuccessResponse(res).created({ category: category });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const remove = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

module.exports = { get, getAll, create, update, remove };
