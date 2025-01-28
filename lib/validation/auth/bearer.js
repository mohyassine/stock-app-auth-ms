const Joi = require('joi');

module.exports = {
  headers: Joi.object({
    authorization: Joi.string()
      .regex(/^Bearer /)
      .required(),
  }).unknown(true),
};
