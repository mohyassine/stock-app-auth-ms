const Joi = require('joi');

const validateTokenSchema = {
  body: Joi.object().keys({ token: Joi.string().required() }).required().unknown(false),
};

module.exports = {
  validateTokenSchema,
};
