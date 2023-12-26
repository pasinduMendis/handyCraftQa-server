const { ErrorResponse } = require("../utils/response.utils");

module.exports = function (validator) {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      return new ErrorResponse(res).badRequest(error.message);
    }
    next();
  };
};
