const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required(),
});

function validateCategory(category) {
  return categorySchema.validate(category);
}

module.exports = {
  validateCategory,
};
