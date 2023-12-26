const { SuccessResponse, ErrorResponse } = require("../utils/response.utils");
const Order = require("../models/Order.model");

const get = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    return new SuccessResponse(res).ok({ order: order });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await Order.find();
    return new SuccessResponse(res).ok({
      orders: orders,
    });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const create = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return new SuccessResponse(res).created({ order: order });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const update = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return new SuccessResponse(res).created({ order: order });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const remove = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return new SuccessResponse(res).created();
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

module.exports = { get, getAll, create, update, remove };
