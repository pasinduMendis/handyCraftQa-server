const { ErrorResponse } = require("../utils/response.utils");
const { verify } = require("../utils/session.utils.js");

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const payload = await verify(authHeader);

    req.user = payload.toObject();
    next();
  } catch (error) {
    return new ErrorResponse(res).internalServerError(error.message);
  }
};

module.exports = authorize;
