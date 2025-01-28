const Joi = require('joi');

const phoneNumberCountrySchema = Joi.object()
  .keys({
    id: Joi.number().required(),
    description: Joi.string().required(),
    code: Joi.string().required(),
  })
  .strict()
  .unknown(false);

const phoneNumberSchema = Joi.object()
  .keys({
    country: phoneNumberCountrySchema.required(),
    nationalNumber: Joi.string().required(),
  })
  .strict()
  .unknown(false);

module.exports = {
  phoneNumberSchema,
  phoneNumberCountrySchema,
};
