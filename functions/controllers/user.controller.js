const { reqVerifyEmail } = require("../services/email.service");
const tokenService = require("../services/email_token.service");
const { ErrorResponse, SuccessResponse } = require("../utils/response.util");
const sessionUtil = require("../utils/session.util");
const { encrypt } = require("../utils/encryption.util");
const { userService } = require("../services/user.service");

const {
    validateUser,
    validateUserLogin,
} = require("../validation/user.schema");

async function login(req, res) {
    try {
        const { error, value } = validateUserLogin(req.body);

        if (error) {
            return new ErrorResponse(res).badRequest(error.message);
        }

        const user = await userService.login(value.email, value.password);

        const accessToken = sessionUtil.sign(
            new sessionUtil.Payload(
                user.id,
                user.email.email,
                user.name.firstName,
                "USER"
            )
        );

        return new SuccessResponse(res).ok({
            user: user.toModel(),
            accessToken: accessToken,
        });
    } catch (error) {
        return new ErrorResponse(res).internalServerError(error.message);
    }
}

async function register(req, res) {
    try {
        const { error, value } = validateUser(req.body);

        if (error) {
            return new ErrorResponse(res).badRequest(error.message);
        }

        const encryptedPassword = await encrypt(value.password);
        const user = await userService.create(value, encryptedPassword);
        await user.save();

        return new SuccessResponse(res).ok({
            user: user.toModel(),
        });
    } catch (error) {
        return new ErrorResponse(res).internalServerError(error.message);
    }
}

async function get(req, res) {
    try {
        const user = await userService.get(req.params.id);

        return new SuccessResponse(res).ok({
            user: user.toModel(),
        });
    } catch (error) {
        return new ErrorResponse(res).internalServerError(error.message);
    }
}

async function getAll(req, res) {
    try {
        const users = await userService.getAll();

        return new SuccessResponse(res).ok({
            users: users.map((user) => user.toModel()),
        });
    } catch (error) {
        return new ErrorResponse(res).internalServerError(error.message);
    }
}

async function update(req, res) {
    try {
        const { error, value } = validateUser(req.body);

        if (error) {
            return new ErrorResponse(res).badRequest(error.message);
        }

        const updatedUser = await userService.update({
            ...value,
            id: req.params.id,
        });

        return new SuccessResponse(res).ok({
            user: updatedUser.toModel(),
        });
    } catch (error) {
        return new ErrorResponse(res).internalServerError(error.message);
    }
}

async function remove(req, res) {
    try {
        await userService.remove(req.params.id);

        return new SuccessResponse(res).ok();
    } catch (error) {
        return new ErrorResponse(res).internalServerError(error.message);
    }
}

async function reqVerificationEmail(req, res) {
    try {
        const id = req.body.id;
        const user = await userService.get(id);

        const token = await tokenService.getOrCreate(id);

        await reqVerifyEmail(user.email.email, token.token);

        return new SuccessResponse(res).ok();
    } catch (error) {
        return new ErrorResponse(res).internalServerError(error.message);
    }
}

async function verifyEmail(req, res) {
    try {
        const id = req.body.id;
        const token = req.body.token;
    
        const user = await userService.get(id);
    
        const savedToken = await tokenService.getByUserId(id);
        if (token !== savedToken.token) {
          return new ErrorResponse(res).internalServerError("Invalid token");
        }
    
        await tokenService.remove(id);
    
        await user.verifyEmail().save();
    
        const updatedUser = await userService.update(user);
    
        const accessToken = sessionUtil.sign(
          new sessionUtil.Payload(
            updatedUser.id,
            updatedUser.email.email,
            updatedUser.name.firstName,
            "USER"
          )
        );
    
        return new SuccessResponse(res).ok({
          user: updatedUser.toModel(),
          accessToken: accessToken,
        });
      } catch (error) {
        return new ErrorResponse(res).internalServerError(error.message);
      }
}

module.exports = {
    userController: {
    login,
    register,
    get,
    getAll,
    update,
    remove,
    reqVerificationEmail,
    verifyEmail,
    },
};