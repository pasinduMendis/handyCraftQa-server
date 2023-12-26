const Joi = require("joi");

const weightSchema = Joi.object({
  value: Joi.number().required(),
  unit: Joi.string().required(),
});

const dimensionsSchema = Joi.object({
  value_x: Joi.number().required(),
  value_y: Joi.number().required(),
  unit: Joi.string().required(),
});

const imageSchema = Joi.object({
  src: Joi.string().required(),
  isMain: Joi.boolean().required(),
});

const createSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  manufacturer: Joi.string().required(),
  price: Joi.string().required(),
  description: Joi.string().required(),
  weight: weightSchema.required(),
  dimensions: dimensionsSchema.required(),
  images: Joi.array().items(imageSchema).required(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  manufacturer: Joi.string(),
  price: Joi.string(),
  description: Joi.string(),
  weight: weightSchema,
  dimensions: dimensionsSchema,
});

function validateCreate(product) {
  return createSchema.validate(product);
}

function validateUpdate(product) {
  return updateSchema.validate(product);
}

module.exports = {
  validateCreate,
  validateUpdate,
};
