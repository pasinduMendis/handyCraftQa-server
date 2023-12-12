const Vendor = require("../models/Vendor.model");
const { isDataMatch } = require("../utils/encryption.util");
const { isValidId } = require("./utils");

const get = async (id) => {
  try {
    isValidId(id);
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      throw new Error("Account not found");
    }
    return vendor;
  } catch (error) {
    throw new Error(error);
  }
};

const isExist = async (id) => {
  try {
    isValidId(id);
    const vendor = await Vendor.findById(id);
    if (vendor) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
};

const isExistForEmail = async (email) => {
  try {
    const vendor = await Vendor.findOne({ "email.email": email });
    if (vendor) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    const vendors = await Vendor.find();
    return vendors;
  } catch (error) {
    throw new Error(error);
  }
};

const create = async (data, password) => {
  try {
    const isExist = await isExistForEmail(data.email.email);
    if (isExist) {
      throw new Error("User already exists for email " + data.email.email);
    }

    const vendor = await Vendor.create({
      ...data,
      password: password,
    });
    return vendor;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (data) => {
  try {
    isValidId(data.id);
    const exist = await isExist(data.id);
    if (!exist) {
      throw new Error("User not found for the uid " + data.id);
    }
    const vendor = await Vendor.findByIdAndUpdate(data.id, data, {
      new: true,
    });
    if (vendor) {
      return vendor;
    }
    throw new Error("Error while updating the user");
  } catch (error) {
    throw new Error(error);
  }
};

const remove = async (id) => {
  try {
    isValidId(id);
    const exist = await isExist(id);
    if (!exist) {
      throw new Error("Account does not exist");
    }
    await Vendor.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};

const login = async (email, password) => {
  try {
    const isExist = await isExistForEmail(email);
    if (!isExist) {
      throw new Error("No user exists for email " + email);
    }

    const vendor = await Vendor.findOne({ "email.email": email });
    if (!vendor) {
      throw new Error("No user exists for email " + email);
    }

    const isMatch = await isDataMatch(password, vendor.password);

    if (isMatch) {
      return vendor;
    }
    throw new Error("Wrong password");
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  vendorService: {
    get,
    isExist,
    isExistForEmail,
    getAll,
    create,
    update,
    login,
    remove,
  },
};
