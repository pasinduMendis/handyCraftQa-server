const Business = require("../models/Business.model");
const { isValidId } = require("./utils");

const get = async (id) => {
  try {
    isValidId(id);
    const business = await Business.findById(id);
    if (business) {
      return business;
    }
    throw new Error("Business not found");
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    const businesses = await Business.find();
    return businesses;
  } catch (error) {
    throw new Error(error);
  }
};

const getByBrn = async (brn) => {
  try {
    const business = await Business.findOne({ "brn.number": brn });
    if (business) {
      return business;
    }
    throw new Error("Business not found");
  } catch (error) {
    throw new Error(error);
  }
};

const getByVendorId = async (id) => {
  try {
    isValidId(id);
    const business = await Business.findOne({ vendorId: id });
    if (business) {
      return business;
    }
    throw new Error("Business not found");
  } catch (error) {
    throw new Error(error);
  }
};

const isExist = async (id) => {
  try {
    isValidId(id);
    const business = await Business.findById(id);
    if (business) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
};

const isExistForBrn = async (brn) => {
  try {
    const business = await Business.findOne({ "brn.number": brn });
    if (business) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
};

const create = async (data) => {
  try {
    const isExist = await isExistForBrn(data.brn.number);

    if (isExist) {
      throw new Error("Business registration number already used");
    }

    const business = await Business.create(data);

    return business;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (data) => {
  try {
    const exist = await isExist(data.id);

    if (!exist) {
      throw new Error("Business not found");
    }

    const business = await Business.findByIdAndUpdate(data.id, data, {
      new: true,
    });
    if (business) {
      return business;
    }
    throw new Error("Error while updating business");
  } catch (error) {
    throw new Error(error);
  }
};

const remove = async (id) => {
  try {
    isValidId(id);
    const exist = await isExist(id);
    if (!exist) {
      throw new Error("Business not found");
    }
    await Business.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  businessService: {
    get,
    getAll,
    getByBrn,
    getByVendorId,
    isExist,
    isExistForBrn,
    create,
    update,
    remove,
  },
};
