const Joi = require("joi");

const itemSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const orderSchema = Joi.object({
  customer: Joi.string().required(),
  items: Joi.array().items(itemSchema).min(1).required(),
});

function validateOrder(order) {
  return orderSchema.validate(order);
}

module.exports = {
  validateOrder,
  orderSchema,
};
