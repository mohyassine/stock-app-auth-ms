const {
  recoverUsername,
  passwordRecoveryVerification,
  requestPasswordRecovery,
  resetPassword,
} = require('./recovery');
const { register, signIn } = require('./auth');
const { validateKey } = require('./validation');
const { resendAccountConfirmationEmail } = require('./confirmation');
const { verifyEmail, verifyMobileNumber } = require('./verification');

module.exports = {
  recoverUsername,
  register,
  requestPasswordRecovery,
  passwordRecoveryVerification,
  resendAccountConfirmationEmail,
  resetPassword,
  signIn,
  verifyEmail,
  verifyMobileNumber,
  validateKey,
};
