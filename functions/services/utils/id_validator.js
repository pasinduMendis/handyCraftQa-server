const ObjectId = require("mongoose").Types.ObjectId;

const isValidId = (id) => {
  if (!ObjectId.isValid(id)) {
    throw new Error("The id you provided is not valid");
  }
};

module.exports = isValidId;
