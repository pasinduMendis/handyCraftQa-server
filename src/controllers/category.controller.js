const { categoryService } = require("../services/category.service");
const { SuccessResponse, ErrorResponse } = require("../utils/response.util");
const { validateCategory } = require("../validation/category.schema");

const get = async (req, res) => {
  try {
    const category = await categoryService.get(req.params.id);
    return new SuccessResponse(res).ok({ category: category });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAll();
    return new SuccessResponse(res).ok({
      categories: categories,
    });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = validateCategory(req.body);
    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }
    const category = await categoryService.create(value);
    return new SuccessResponse(res).created({ category: category });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { error, value } = validateCategory(req.body);
    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }
    const category = await categoryService.update({ ...value, id: id });
    return new SuccessResponse(res).created({ category: category });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const remove = async (req, res) => {
  try {
    await categoryService.remove(req.params.id);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

module.exports = {
  categoryController: { get, getAll, create, update, remove },
};
