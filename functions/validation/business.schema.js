const Joi = require("joi");

const addressSchema = Joi.object({
  country: Joi.string().required(),
  state: Joi.string().required(),
  street: Joi.string().required(),
});

const brnSchema = Joi.object({
  number: Joi.string().required(),
});

const brcSchema = Joi.object({
  file: Joi.string().required(),
});

const registerBusinessSchema = Joi.object({
  businessName: Joi.string().required(),
  businessType: Joi.string().required(),
  brn: brnSchema.required(),
  brc: brcSchema.required(),
  address: addressSchema.required(),
});

const businessSchema = Joi.object({
  businessName: Joi.string(),
  businessType: Joi.string(),
  brn: brnSchema,
  brc: brcSchema,
  address: addressSchema,
});

function validateRegisterBusiness(business) {
  return registerBusinessSchema.validate(business);
}

function validateBusiness(business) {
  return businessSchema.validate(business);
}

module.exports = {
  validateRegisterBusiness,
  validateBusiness,
};
