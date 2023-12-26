const bcrypt = require("bcryptjs");

const encrypt = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const encryptedData = await bcrypt.hash(data, salt);
  return encryptedData;
};

const isDataMatch = async (row, encrypted) => {
  const isMatch = await bcrypt.compare(row, encrypted);
  return isMatch;
};

module.exports = { encrypt, isDataMatch };
