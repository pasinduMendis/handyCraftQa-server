const Joi = require("joi");

const emailSchema = Joi.object({
  email: Joi.string().required(),
  isVerified: Joi.boolean().default(false),
});

const phoneSchema = Joi.object({
  phone: Joi.string().required(),
  isVerified: Joi.boolean().default(false),
});

const addressSchema = Joi.object({
  country: Joi.string().required(),
  state: Joi.string().required(),
  street: Joi.string().required(),
});

const nameSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

const cartItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const userSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema,
  password: Joi.string().required(),
  cart: Joi.array().items(cartItemSchema), 
});

const userLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

function validateUser(user) {
  return userSchema.validate(user);
}

function validateUserLogin(user) {
  return userLoginSchema.validate(user);
}

module.exports = {
  validateUser,
  validateUserLogin,
};
