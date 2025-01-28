const Joi = require('joi');

module.exports = {
  headers: Joi.object({
    accept: Joi.string()
      .regex(/^\bapplication\/vnd\.nasco\.auth\b/)
      .required(),
  }).unknown(true),
};
