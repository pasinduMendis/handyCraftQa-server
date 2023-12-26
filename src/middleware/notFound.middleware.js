const { ErrorResponse } = require("../utils/response.utils");

module.exports = (req, res) => new ErrorResponse(res).notFound();
