const { businessService } = require("../services/business.service");
const { vendorService } = require("../services/vendor.service");
const { SuccessResponse, ErrorResponse } = require("../utils/response.util");
const { validateBusiness } = require("../validation/business.schema");

const create = async (req, res) => {
  try {
    const user = req.user;
    const { error, value } = validateBusiness(req.body);
    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }
    const business = await businessService.create({
      ...value,
      vendorId: user.id,
    });
    const vendor = await vendorService.get(user.id);
    await vendor.completeBusinessRegistration().save();
    return new SuccessResponse(res).created({
      business: business.toModel(),
    });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const get = async (req, res) => {
  try {
    const id = req.params.id;

    const forBrn = await businessService.isExistForBrn(id);
    if (forBrn) {
      const business = await businessService.getByBrn(id);
      return new SuccessResponse(res).ok({ business: business.toModel() });
    }

    const forId = await businessService.isExist(id);
    if (forId) {
      const business = await businessService.get(id);
      return new SuccessResponse(res).created({ business: business.toModel() });
    }

    return new ErrorResponse(res).internalServerError("Business not found");
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const businesses = await businessService.getAll();
    return new SuccessResponse(res).ok({
      businesses: businesses.map((business) => business.toModel()),
    });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const update = async (req, res) => {
  try {
    const user = req.user;
    const { error, value } = validateBusiness(req.body);
    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }
    const business = await businessService.getByVendorId(user.id);
    const updatedBusiness = await businessService.update({
      ...value,
      id: business.id,
    });
    return new SuccessResponse(res).ok({ business: updatedBusiness.toModel() });
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

const remove = async (req, res) => {
  try {
    await businessService.remove(req.params.id);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).badRequest(error.message);
  }
};

module.exports = {
  businessController: { create, update, get, getAll, remove },
};
