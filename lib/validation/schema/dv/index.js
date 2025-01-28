const Joi = require('joi');

const genericDvSchema = Joi.object()
  .keys({
    id: Joi.number().required(),
    description: Joi.string().required(),
  })
  .optional()
  .allow(null)
  .strict()
  .unknown(false);

const requiredGenericSchema = Joi.object()
  .keys({
    id: Joi.number().required(),
    description: Joi.string().required(),
  })
  .required()
  .strict()
  .unknown(false);

const genericDvWithCodeSchema = Joi.object()
  .keys({
    id: Joi.number().required(),
    code: Joi.string().required(),
    description: Joi.string().required(),
    longDescrioption: Joi.string().optional(),
  })
  .optional()
  .allow(null)
  .strict()
  .unknown(false);

const genericNationalityDvSchema = Joi.object()
  .keys({
    id: Joi.number().required(),
    code: Joi.string().required(),
    description: Joi.string().required(),
    nationalityId: Joi.number().optional(),
    isDefault: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional(),
  })
  .optional()
  .strict()
  .unknown(false);

module.exports = {
  genericDvSchema,
  genericDvWithCodeSchema,
  requiredGenericSchema,
  genericNationalityDvSchema,
};
