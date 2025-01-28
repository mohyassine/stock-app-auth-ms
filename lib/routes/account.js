const { validate } = require('express-validation');

const {
  recoverUsername,
  register,
  requestPasswordRecovery,
  passwordRecoveryVerification,
  resendAccountConfirmationEmail,
  resetPassword,
  signIn,
  verifyEmail,
  validateKey,
} = require('../controllers/account');
const { tenantCheck } = require('../validation/auth');
const {
  accountConfirmationEmail,
  emailVerification,
  keyValidation,
  passwordRecovery,
  passwordReset,
  signIn: signInValidation,
  signUp: signUpValidation,
  usernameRecovery,
  otpVerificationPasswordRecovery,
} = require('../validation/schema/account');
const { checkVersion } = require('../validation/version');

function accountRoute(router) {
  router.post(
    '/signin',
    validate(checkVersion),
    validate(tenantCheck),
    validate(signInValidation),
    signIn,
  );

  router.post(
    '/signup',
    validate(checkVersion),
    validate(tenantCheck),
    validate(signUpValidation),
    register,
  );

  router.post(
    '/verification/email',
    validate(checkVersion),
    validate(tenantCheck),
    validate(emailVerification),
    verifyEmail,
  );

  router.post(
    '/confirmation/resend',
    validate(checkVersion),
    validate(tenantCheck),
    validate(accountConfirmationEmail),
    resendAccountConfirmationEmail,
  );

  router.post(
    '/validation/:key',
    validate(checkVersion),
    validate(tenantCheck),
    validate(keyValidation, { context: true }),
    validateKey,
  );

  router.post(
    '/recovery/password',
    validate(checkVersion),
    validate(tenantCheck),
    validate(passwordRecovery),
    requestPasswordRecovery,
  );

  router.post(
    '/recovery/password/confirmation',
    validate(checkVersion),
    validate(tenantCheck),
    validate(otpVerificationPasswordRecovery),
    passwordRecoveryVerification,
  );

  router.post(
    '/recovery/password/reset',
    validate(checkVersion),
    validate(tenantCheck),
    validate(passwordReset),
    resetPassword,
  );

  router.post(
    '/recovery/username',
    validate(checkVersion),
    validate(tenantCheck),
    validate(usernameRecovery),
    recoverUsername,
  );

  return router;
}

module.exports = accountRoute;
