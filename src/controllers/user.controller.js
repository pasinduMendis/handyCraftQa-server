const { reqVerifyEmail } = require("../utils/email.utils");
const { ErrorResponse, SuccessResponse } = require("../utils/response.utils");
const sessionUtil = require("../utils/session.utils.js");
const User = require("../models/User.model");
const EmailToken = require("../models/EmailToken.model");
const { encrypt, isDataMatch } = require("../utils/encryption.utils");
const crypto = require("crypto");

async function login(req, res) {
  try {
    const user = await User.findOne({ "email.email": req.body.email });

    if (!user) {
      return new ErrorResponse(res).badRequest("Invalid email or password");
    }

    const isMatch = await isDataMatch(req.body.password, user.password);

    if (!isMatch) {
      return new ErrorResponse(res).badRequest("Invalid email or password");
    }

    const accessToken = sessionUtil.sign(
      new sessionUtil.Payload(
        user.id,
        user.email.email,
        user.name.firstName,
        "USER"
      )
    );

    return new SuccessResponse(res).ok({
      user: user,
      accessToken: accessToken,
      refreshToken: "",
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function register(req, res) {
  try {
    const encryptedPassword = await encrypt(req.body.password);
    const user = await User.create({
      ...req.body,
      password: encryptedPassword,
    });
    return new SuccessResponse(res).created({
      user: user,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function get(req, res) {
  try {
    const user = await User.findById(req.params.id);
    return new SuccessResponse(res).ok({
      user: user,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function getAll(req, res) {
  try {
    const users = await User.find();
    return new SuccessResponse(res).ok({
      users: users,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function update(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.param.id, req.body, {
      new: true,
      runValidators: true,
    });

    return new SuccessResponse(res).created({
      user: user,
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function remove(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    return new SuccessResponse(res).created();
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function reqVerificationEmail(req, res) {
  try {
    const user = await User.findById(req.body.id);

    if (!user) {
      return new ErrorResponse(res).badRequest("User not found");
    }

    const existToken = await EmailToken.findOne({ user: req.body.id });

    if (existToken) {
      await reqVerifyEmail(user.email.email, existToken.token);
      return new SuccessResponse(res).ok();
    }

    const hash = crypto.randomBytes(32).toString("hex");
    const newToken = await EmailToken.create({
      user: user.id,
      token: hash,
    });
    await reqVerifyEmail(user.email.email, newToken.token);
    return new SuccessResponse(res).ok();
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

async function verifyEmail(req, res) {
  try {
    const user = await User.findById(req.body.id);

    if (!user) {
      return new ErrorResponse(res).badRequest("User not found");
    }

    const savedToken = await EmailToken.findOne({ user: req.body.id });
    if (!savedToken) {
      return new ErrorResponse(res).internalServerError("Token not found");
    }
    if (req.body.token !== savedToken.token) {
      return new ErrorResponse(res).internalServerError("Invalid token");
    }

    await EmailToken.findByIdAndDelete(savedToken.id);

    const updatedUser = await user.verifyEmail().save();

    const accessToken = sessionUtil.sign(
      new sessionUtil.Payload(
        updatedUser.id,
        updatedUser.email.email,
        updatedUser.name.firstName,
        "USER"
      )
    );

    return new SuccessResponse(res).ok({
      user: updatedUser,
      accessToken: accessToken,
      refreshToken: "",
    });
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
}

module.exports = {
  login,
  register,
  get,
  getAll,
  update,
  remove,
  reqVerificationEmail,
  verifyEmail,
};
