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

const vendorSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  identity: identitySchema,
  phone: phoneSchema,
  address: addressSchema,
});

const basicVendorSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema.required(),
  password: Joi.string().required(),
});

const advancedVendorSchema = Joi.object({
  identity: identitySchema.required(),
  phone: phoneSchema.required(),
  address: addressSchema.required(),
});

const vendorLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

function validateBasicVendor(vendor) {
  return basicVendorSchema.validate(vendor);
}

function validateAdvancedVendor(vendor) {
  return advancedVendorSchema.validate(vendor);
}

function validateVendor(vendor) {
  return vendorSchema.validate(vendor);
}
function validateVendorLogin(vendor) {
  return vendorLoginSchema.validate(vendor);
}

module.exports = {
  validateBasicVendor,
  validateAdvancedVendor,
  validateVendorLogin,
  validateVendor,
};
