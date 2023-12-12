const Product = require("../models/Product.model");
const { isValidId } = require("./utils");

const get = async (id) => {
  try {
    isValidId(id);
    const product = await Product.findById(id);
    if (product) {
      return product;
    }
    throw new Error("Product not found");
  } catch (error) {
    throw new Error(error);
  }
};

const isExist = async (id) => {
  try {
    isValidId(id);
    const product = await Product.findById(id);
    if (product) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error(error);
  }
};

const create = async (data) => {
  try {
    isValidId(data.categoryId);
    isValidId(data.businessId);
    const product = await Product.create(data);
    return product;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (data) => {
  try {
    isValidId(data.id);
    if (data.categoryId) {
      isValidId(data.categoryId);
    }
    const product = await Product.findByIdAndUpdate(data.id, data, {
      new: true,
    });
    if (product) {
      return product;
    }
    throw new Error("Error while updating product");
  } catch (error) {
    throw new Error(error);
  }
};

const remove = async (id) => {
  try {
    isValidId(id);
    const exist = await isExist(id);
    if (!exist) {
      throw new Error("Product not found");
    }
    await Product.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  productService: { get, isExist, getAll, create, update, remove },
};
