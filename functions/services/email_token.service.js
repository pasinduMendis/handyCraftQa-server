const EmailToken = require("../models/EmailToken.model");
const crypto = require("crypto");

const getByUserId = async (id) => {
  try {
    let registeredToken = await EmailToken.findOne({ vendorId: id });

    if (!registeredToken) {
      throw new Error("Token not found");
    }

    return registeredToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

const isExistForVendorId = async (id) => {
  try {
    let registeredToken = await EmailToken.findOne({ vendorId: id });

    if (registeredToken) {
      return true;
    }

    return false;
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (id) => {
  try {
    const exist = await isExistForVendorId(id);
    if (exist) {
      throw new Error("Token already exists");
    }

    const hash = crypto.randomBytes(32).toString("hex");
    const token = await EmailToken.create({
      vendorId: id,
      token: hash,
    });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrCreate = async (id) => {
  try {
    const token = await EmailToken.findOne({ vendorId: id });
    if (token) {
      return token;
    }

    const newToken = create(id);
    return newToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

const remove = async (id) => {
  try {
    await EmailToken.findOneAndDelete({ vendorId: id });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getByUserId,
  isExistForVendorId,
  create,
  getOrCreate,
  remove,
};
