const logger = require('../../utils/logger').Logger;

const { SUCCESS, LOCKED, FORBIDDEN, SERVER_ERROR } = require('../../utils/server-codes');
const { makeError } = require('../../errors/utils');

const { signIn: signInService } = require('../../services/account/auth');

const { errorCodes: identityErrorCodes } = require('../../utils/iam');

const {
  INTERNAL_ERROR,
  LOGIN_FAILED,
  VERIFICATION_REQUIRED,
  LOGIN_ATTEMPTS_EXCEEDED,
  USER_DEACTIVATED,
} = require('../../utils/server-messages');

async function authPaymentWebhook(req, res) {
  try {
    const { username, password } = req.body;
    const tenantId = req.header('x-tenant-platform');

    const result = await signInService(username, password, tenantId);

    res.statusCode = SUCCESS;

    res.json(result.data);
  } catch (error) {
    logger.error(error);

    let errorCode = error.status || SERVER_ERROR;

    let errorMessage = error.status ? error.message : INTERNAL_ERROR;

    const serverError = error.response && error.response.data;
    // oauth endpoint does not return useful error information
    const errorDescriptionCode = serverError && serverError.error_description;

    if (serverError && errorDescriptionCode === identityErrorCodes.VERIFICATION_REQUIRED) {
      errorCode = LOCKED;
      errorMessage = VERIFICATION_REQUIRED;
    } else if (serverError && errorDescriptionCode === identityErrorCodes.ACCOUNT_LOCKED) {
      errorCode = LOCKED;
      errorMessage = LOGIN_ATTEMPTS_EXCEEDED;
    } else if (serverError && errorDescriptionCode === identityErrorCodes.ACCOUNT_DISABLED) {
      errorCode = FORBIDDEN;
      errorMessage = USER_DEACTIVATED;
    } else {
      errorCode = FORBIDDEN;
      errorMessage = LOGIN_FAILED;
    }

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

module.exports = {
  authPaymentWebhook,
};
