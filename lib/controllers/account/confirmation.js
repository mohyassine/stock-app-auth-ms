const util = require('util');

const { sendAccountConfirmationEmail } = require('../../services');
const { makeError } = require('../../errors/utils');
const logger = require('../../utils/logger').Logger;
const { errorCodes: identityErrorCodes } = require('../../utils/iam');
const {
  INTERNAL_ERROR,
  INVALID_REQUEST,
  TOO_MANY_REQUESTS_MESSAGE,
} = require('../../utils/server-messages');
const {
  SUCCESS_NO_CONTENT,
  SERVER_ERROR,
  NOT_ACCEPTABLE,
  TOO_MANY_REQUESTS,
} = require('../../utils/server-codes');
const getHumanScore = require('../../utils/validateHuman');
const { thresholds } = require('../../config/settings');

async function resendAccountConfirmationEmail(req, res) {
  try {
    const { username, token } = req.body;
    const tenantId = req.header('x-tenant-platform');

    const score = await getHumanScore(token);

    if (score < thresholds.humanScore) {
      throw makeError(TOO_MANY_REQUESTS_MESSAGE, TOO_MANY_REQUESTS);
    }

    await sendAccountConfirmationEmail(username, tenantId);

    logger.info(util.format('Account confirmation email sent to [%s]', username));

    res.statusCode = SUCCESS_NO_CONTENT;
    res.end();
  } catch (error) {
    logger.error(error);

    let errorCode = error.status || SERVER_ERROR;
    let errorMessage = error.status ? error.message : INTERNAL_ERROR;

    const serverError = error.response && error.response.data;

    if (serverError && error.response.status === identityErrorCodes.BAD_REQUEST) {
      errorCode = NOT_ACCEPTABLE;
      errorMessage = INVALID_REQUEST;
    }

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

module.exports = { resendAccountConfirmationEmail };
