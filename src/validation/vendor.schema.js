const Joi = require("joi");

const emailSchema = Joi.object({
  email: Joi.string().required(),
});

const identitySchema = Joi.object({
  type: Joi.string().valid("NIC", "PASSPORT", "DRIVING_LICENSE").required(),
  id: Joi.string().required(),
  file: Joi.string().required(),
});

const phoneSchema = Joi.object({
  phone: Joi.string().required(),
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

const basicRegistrationSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema.required(),
  password: Joi.string().required(),
});

const advancedRegistrationSchema = Joi.object({
  identity: identitySchema.required(),
  phone: phoneSchema.required(),
  address: addressSchema.required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  identity: identitySchema,
  phone: phoneSchema,
  address: addressSchema,
});

function validateBasicRegistration(vendor) {
  return basicRegistrationSchema.validate(vendor);
}

function validateAdvancedRegistration(vendor) {
  return advancedRegistrationSchema.validate(vendor);
}

function validateLogin(vendor) {
  return loginSchema.validate(vendor);
}

function validateUpdate(vendor) {
  return updateSchema.validate(vendor);
}

module.exports = {
  validateBasicRegistration,
  validateAdvancedRegistration,
  validateLogin,
  validateUpdate,
};
