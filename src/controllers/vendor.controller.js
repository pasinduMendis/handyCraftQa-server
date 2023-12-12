const { reqVerifyEmail } = require("../services/email.service");
const tokenService = require("../services/email_token.service");
const { ErrorResponse, SuccessResponse } = require("../utils/response.util");
const { vendorService } = require("../services/vendor.service");
const sessionUtil = require("../utils/session.util");
const { encrypt } = require("../utils/encryption.util");
const {
  validateVendor,
  validateBasicVendor,
  validateAdvancedVendor,
  validateVendorLogin,
} = require("../validation/vendor.schema");

async function login(req, res) {
  try {
    const { error, value } = validateVendorLogin(req.body);

    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }

    const vendor = await vendorService.login(value.email, value.password);

    const accessToken = sessionUtil.sign(
      new sessionUtil.Payload(
        vendor.id,
        vendor.email.email,
        vendor.name.firstName,
        "VENDOR"
      )
    );

    return new SuccessResponse(res).ok({
      vendor: vendor.toModel(),
      accessToken: accessToken,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function basicRegistration(req, res) {
  try {
    const { error, value } = validateBasicVendor(req.body);

    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }

    const encryptedPassword = await encrypt(value.password);
    const vendor = await vendorService.create(value, encryptedPassword);
    await vendor.completeBasicRegistration().save();

    return new SuccessResponse(res).ok({
      vendor: vendor.toModel(),
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function advancedRegistration(req, res) {
  try {
    const user = req.user;

    const { error, value } = validateAdvancedVendor(req.body);

    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }

    const updatedVendor = await vendorService.update({ ...value, id: user.id });
    await updatedVendor.completeAdvancedRegistration().save();

    return new SuccessResponse(res).ok({
      vendor: updatedVendor.toModel(),
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function get(req, res) {
  try {
    const vendor = await vendorService.get(req.params.id);
    return new SuccessResponse(res).ok({
      vendor: vendor.toModel(),
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function getAll(req, res) {
  try {
    const vendors = await vendorService.getAll();
    return new SuccessResponse(res).ok({
      vendors: vendors.map((vendor) => vendor.toModel()),
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function reqVerificationEmail(req, res) {
  try {
    const id = req.body.id;
    const vendor = await vendorService.get(id);

    const token = await tokenService.getOrCreate(id);

    await reqVerifyEmail(
      id,
      token.token,
      vendor.email.email,
      vendor.name.firstName
    );
    return new SuccessResponse(res).ok({
      vendor: vendor.toModel(),
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function verifyEmail(req, res) {
  try {
    const id = req.body.id;
    const token = req.body.token;

    const vendor = await vendorService.get(id);

    const savedToken = await tokenService.getByUserId(id);
    if (token !== savedToken.token) {
      return new ErrorResponse(res).internalServerError("Invalid token");
    }

    await tokenService.remove(id);

    await vendor.verifyEmail().save();

    const updatedVendor = await vendorService.update(vendor);

    const accessToken = sessionUtil.sign(
      new sessionUtil.Payload(
        updatedVendor.id,
        updatedVendor.email.email,
        updatedVendor.name.firstName,
        "VENDOR"
      )
    );

    return new SuccessResponse(res).ok({
      vendor: updatedVendor.toModel(),
      accessToken: accessToken,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function update(req, res) {
  try {
    const user = req.user;

    const { error, value } = validateVendor(req.body);
    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }

    const updatedVendor = await vendorService.update({ ...value, id: user.id });

    return new SuccessResponse(res).ok({
      vendor: updatedVendor.toModel(),
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function remove(req, res) {
  try {
    const user = req.user;
    await vendorService.remove(user.id);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

module.exports = {
  vendorController: {
    login,
    basicRegistration,
    advancedRegistration,
    get,
    getAll,
    reqVerificationEmail,
    verifyEmail,
    update,
    remove,
  },
};
