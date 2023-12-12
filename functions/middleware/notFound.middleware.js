const { ErrorResponse } = require("../utils/response.util");

const notFound = (req, res) => new ErrorResponse(res).notFound();

module.exports = notFound;
