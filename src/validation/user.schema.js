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
  quantity: Joi.number().integer().min(1).default(1),
});

const updateSchema = Joi.object({
  name: nameSchema,
  phone: phoneSchema,
  address: addressSchema,
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema.required(),
  password: Joi.string().required(),
  phone: phoneSchema.required(),
  address: addressSchema.required(),
});

const updateCartSchema = Joi.object({
  cart: Joi.array().items(cartItemSchema).required(),
});

function validateUpdate(user) {
  return updateSchema.validate(user);
}

function validateLogin(user) {
  return loginSchema.validate(user);
}

function validateRegister(user) {
  return registerSchema.validate(user);
}

function validateUpdateCart(user) {
  return updateCartSchema.validate(user);
}

module.exports = {
  validateUpdate,
  validateLogin,
  validateRegister,
  validateUpdateCart,
};
