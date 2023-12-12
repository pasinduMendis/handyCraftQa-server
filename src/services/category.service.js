const Category = require("../models/Category.model");
const { isValidId } = require("./utils");

const get = async (id) => {
  try {
    isValidId(id);
    const category = await Category.findById(id);
    if (category) {
      return category;
    }
    throw new Error("Category not found");
  } catch (error) {
    throw new Error(error);
  }
};

const isExist = async (id) => {
  try {
    isValidId(id);
    const category = await Category.findById(id);
    if (category) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    const categories = await Category.find();
    if (categories) {
      return categories;
    }
    throw new Error("Categories not found");
  } catch (error) {
    throw new Error(error);
  }
};

const create = async (data) => {
  try {
    const category = await Category.create(data);
    return category;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (data) => {
  try {
    const category = await Category.findByIdAndUpdate(data.id, data, {
      new: true,
    });
    if (category) {
      return category;
    }
    throw new Error("Error while updating category");
  } catch (error) {
    throw new Error(error);
  }
};

const remove = async (id) => {
  try {
    isValidId(id);
    const exist = await isExist(id);
    if (!exist) {
      throw new Error("Category not found");
    }
    await Category.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { categoryService: { get, getAll, create, update, remove } };
