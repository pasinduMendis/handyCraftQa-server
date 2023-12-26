const Business = require("../models/Business.model");
const Vendor = require("../models/Vendor.model");
const { SuccessResponse, ErrorResponse } = require("../utils/response.utils");

const create = async (req, res) => {
  try {
    const user = req.user;
    const business = await Business.create({
      ...req.body,
      vendorId: user.id,
    });

    const vendor = await Vendor.findById(user.id);
    if (!vendor) {
      return new ErrorResponse(res).badRequest("Vendor not found");
    }

    await vendor.completeBusinessRegistration().save();
    return new SuccessResponse(res).created({
      business: business,
    });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const get = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    return new SuccessResponse(res).ok({ business: business });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const businesses = await Business.find();
    return new SuccessResponse(res).ok({
      businesses: businesses,
    });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const update = async (req, res) => {
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return new SuccessResponse(res).ok({ business: updatedBusiness });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const remove = async (req, res) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

module.exports = { create, update, get, getAll, remove };
