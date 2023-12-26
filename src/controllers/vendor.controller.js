const { reqVerifyEmail } = require("../utils/email.utils");
const { ErrorResponse, SuccessResponse } = require("../utils/response.utils");
const sessionUtil = require("../utils/session.utils.js");
const { encrypt, isDataMatch } = require("../utils/encryption.utils");
const Vendor = require("../models/Vendor.model");
const EmailToken = require("../models/EmailToken.model");
const crypto = require("crypto");

async function login(req, res) {
  try {
    const vendor = await Vendor.findOne({ "email.email": req.body.email });

    if (!vendor) {
      return new ErrorResponse(res).badRequest("Invalid email or password");
    }

    const isMatch = await isDataMatch(req.body.password, vendor.password);

    if (!isMatch) {
      return new ErrorResponse(res).badRequest("Invalid email or password");
    }

    const accessToken = sessionUtil.sign(
      new sessionUtil.Payload(
        vendor.id,
        vendor.email.email,
        vendor.name.firstName,
        "VENDOR"
      )
    );

    return new SuccessResponse(res).ok({
      vendor: vendor,
      accessToken: accessToken,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function basicRegistration(req, res) {
  try {
    const encryptedPassword = await encrypt(req.body.password);
    const vendor = await Vendor.create({
      ...req.body,
      password: encryptedPassword,
    });
    await vendor.completeBasicRegistration().save();

    return new SuccessResponse(res).created({
      vendor: vendor,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function advancedRegistration(req, res) {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.param.id,
      {
        ...req.body,
      },
      { new: true }
    );
    await vendor?.completeAdvancedRegistration().save();
    return new SuccessResponse(res).created({
      vendor: vendor,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function get(req, res) {
  try {
    const vendor = await Vendor.findById(req.params.id);
    return new SuccessResponse(res).ok({
      vendor: vendor,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function getAll(req, res) {
  try {
    const vendors = await Vendor.find();
    return new SuccessResponse(res).ok({
      vendors: vendors,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function reqVerificationEmail(req, res) {
  try {
    const vendor = await Vendor.findById(req.body.id);

    if (!vendor) {
      return new ErrorResponse(res).badRequest("Vendor not found");
    }

    const existToken = await EmailToken.findOne({ user: req.body.id });

    if (existToken) {
      await reqVerifyEmail(vendor.email.email, existToken.token);
      return new SuccessResponse(res).ok();
    }

    const hash = crypto.randomBytes(32).toString("hex");
    const newToken = await EmailToken.create({
      user: vendor.id,
      token: hash,
    });
    await reqVerifyEmail(vendor.email.email, newToken.token);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function verifyEmail(req, res) {
  try {
    const vendor = await Vendor.findById(req.body.id);

    if (!vendor) {
      return new ErrorResponse(res).badRequest("Vendor not found");
    }

    const savedToken = await EmailToken.findOne({ user: req.body.id });
    if (!savedToken) {
      return new ErrorResponse(res).internalServerError("Token not found");
    }
    if (req.body.token !== savedToken.token) {
      return new ErrorResponse(res).internalServerError("Invalid token");
    }

    await EmailToken.findByIdAndDelete(savedToken.id);

    const updatedVendor = await vendor.verifyEmail().save();

    const accessToken = sessionUtil.sign(
      new sessionUtil.Payload(
        updatedVendor.id,
        updatedVendor.email.email,
        updatedVendor.name.firstName,
        "VENDOR"
      )
    );

    return new SuccessResponse(res).ok({
      vendor: updatedVendor,
      accessToken: accessToken,
      refreshToken: "",
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function update(req, res) {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    return new SuccessResponse(res).created({
      vendor: vendor,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function remove(req, res) {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    return new SuccessResponse(res).created();
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

module.exports = {
  login,
  basicRegistration,
  advancedRegistration,
  get,
  getAll,
  reqVerificationEmail,
  verifyEmail,
  update,
  remove,
};
