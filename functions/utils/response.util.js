const { StatusCodes } = require("http-status-codes");

const SUCCESS_STATUS = "success";
const ERROR_STATUS = "error";

class ResponseBody {
  constructor(data, status, message, code) {
    this.data = data;
    this.status = status;
    this.message = message;
    this.code = code;
  }

  getBody() {
    return {
      status: this.status,
      data: this.data,
      message: this.message,
      code: this.code,
    };
  }
}

class ErrorResponse {
  constructor(res) {
    this.res = res;
  }

  badRequest(message) {
    return this.res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ResponseBody(
          {},
          ERROR_STATUS,
          message ??
            "The request is invalid or malformed. Please check the provided data and try again.",
          StatusCodes.BAD_REQUEST
        ).getBody()
      );
  }

  unAuthorized(message) {
    return this.res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ResponseBody(
          {},
          ERROR_STATUS,
          message ??
            "You are not authorized to access this resource. Please log in or provide valid credentials.",
          StatusCodes.UNAUTHORIZED
        ).getBody()
      );
  }

  notFound(message) {
    return this.res
      .status(StatusCodes.NOT_FOUND)
      .json(
        new ResponseBody(
          {},
          ERROR_STATUS,
          message ?? "The requested resource was not found on the server.",
          StatusCodes.NOT_FOUND
        ).getBody()
      );
  }

  internalServerError(message) {
    return this.res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ResponseBody(
          {},
          ERROR_STATUS,
          message ??
            "An unexpected error occurred on the server. Please try again later or contact the support team for assistance.",
          StatusCodes.INTERNAL_SERVER_ERROR
        ).getBody()
      );
  }

  serviceUnavailable(message) {
    return this.res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json(
        new ResponseBody(
          {},
          ERROR_STATUS,
          message ??
            "The server is currently unable to handle the request due to maintenance or overload. Please try again later.",
          StatusCodes.SERVICE_UNAVAILABLE
        ).getBody()
      );
  }
}

class SuccessResponse {
  constructor(res) {
    this.res = res;
  }

  ok(data, message) {
    return this.res
      .status(StatusCodes.OK)
      .json(
        new ResponseBody(
          data ?? {},
          SUCCESS_STATUS,
          message ?? "Request successful",
          StatusCodes.OK
        ).getBody()
      );
  }

  created(data, message) {
    return this.res
      .status(StatusCodes.CREATED)
      .json(
        new ResponseBody(
          data ?? {},
          SUCCESS_STATUS,
          message ?? "Resource created successfully",
          StatusCodes.CREATED
        ).getBody()
      );
  }
}

module.exports = {
  ErrorResponse: ErrorResponse,
  SuccessResponse: SuccessResponse,
};
