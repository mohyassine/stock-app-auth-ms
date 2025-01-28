const Joi = require('joi');
const { IS_TENANTS } = require('../../config/globals');

const tenantSchema = Joi.object({
  'x-tenant-platform': Joi.string()
    .valid(...Object.keys(IS_TENANTS))
    .required(),
});

module.exports = {
  headers: tenantSchema.unknown(true),
};
