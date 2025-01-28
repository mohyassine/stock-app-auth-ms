const Joi = require('joi');
const { usernameLength, nameLength } = require('../../config/settings');
const { noSpecialCharactersRevertedRegExp, usernameRevertedRegExp } = require('../../utils/regex');

const signIn = {
  body: Joi.object()
    .keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })
    .unknown(false),
};

const signUp = {
  body: Joi.object()
    .keys({
      username: Joi.string()
        .required()
        .regex(usernameRevertedRegExp, { invert: true })
        .min(usernameLength.min)
        .max(usernameLength.max),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      firstName: Joi.string()
        .optional()
        .regex(noSpecialCharactersRevertedRegExp, { invert: true })
        .min(nameLength.min)
        .max(nameLength.max),
      lastName: Joi.string()
        .optional()
        .regex(noSpecialCharactersRevertedRegExp, { invert: true })
        .min(nameLength.min)
        .max(nameLength.max),
      token: Joi.string().required(),
    })
    .unknown(false),
};

const passwordRecovery = {
  body: Joi.object()
    .keys({
      username: Joi.string()
        .required()
        .regex(usernameRevertedRegExp, { invert: true })
        .min(usernameLength.min)
        .max(usernameLength.max),
      isEmailChannel: Joi.boolean().optional(),
      token: Joi.string().required(),
    })
    .unknown(false),
};

const otpVerificationPasswordRecovery = {
  body: Joi.object()
    .keys({
      username: Joi.string()
        .required()
        .regex(usernameRevertedRegExp, { invert: true })
        .min(usernameLength.min)
        .max(usernameLength.max),
      otp: Joi.string().length(6).required(),
      isInvitation: Joi.boolean().optional(),
    })
    .unknown(false),
};

const passwordReset = {
  body: Joi.object()
    .keys({
      newPassword: Joi.string().required(),
      username: Joi.string().required(),
    })
    .unknown(false),
};

const usernameRecovery = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
  }),
};

const emailVerification = {
  body: Joi.object().keys({
    code: Joi.string().uuid().required(),
  }),
};

const mobileVerification = {
  body: Joi.object().keys({
    otp: Joi.string().required(),
  }),
};

const accountConfirmationEmail = {
  body: Joi.object().keys({
    username: Joi.string()
      .required()
      .regex(usernameRevertedRegExp, { invert: true })
      .min(usernameLength.min)
      .max(usernameLength.max),
    token: Joi.string().required(),
  }),
};

const keyValidation = {
  body: Joi.object()
    .required()
    .unknown(false)
    .when(Joi.ref('$params.key'), {
      switch: [
        {
          is: 'email',
          then: Joi.object()
            .keys({
              value: Joi.string().email().required(),
              token: Joi.string().required(),
            })
            .required(),
        },
      ],
      otherwise: Joi.object()
        .keys({
          value: Joi.string().required(),
          token: Joi.string().required().allow(''),
        })
        .required(),
    }),
};

module.exports = {
  accountConfirmationEmail,
  emailVerification,
  mobileVerification,
  passwordRecovery,
  passwordReset,
  signIn,
  signUp,
  usernameRecovery,
  keyValidation,
  otpVerificationPasswordRecovery,
};
