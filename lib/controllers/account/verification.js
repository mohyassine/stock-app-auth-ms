const util = require('util');
const isEmpty = require('lodash/isEmpty');

const { makeError } = require('../../errors/utils');
const logger = require('../../utils/logger').Logger;
const {
  findPersonaByUsername,
  updatePersonaById,
  verifyEmail: verifyEmailService,
  verifyOtp,
  updateUserAttributes,
} = require('../../services');
const { errorCodes: identityErrorCodes } = require('../../utils/iam');

const {
  INTERNAL_ERROR,
  INVALID_CODE,
  FORBIDDEN_ACTION_PHONE_NUMBER_VERIFIED,
} = require('../../utils/server-messages');

const {
  SUCCESS_NO_CONTENT,
  SERVER_ERROR,
  NOT_ACCEPTABLE,
  FORBIDDEN,
} = require('../../utils/server-codes');
const { globalSettings } = require('../../config/settings');

async function verifyEmail(req, res) {
  try {
    const { code } = req.body;
    const tenantId = req.header('x-tenant-platform');

    await verifyEmailService(code, tenantId);

    res.statusCode = SUCCESS_NO_CONTENT;
    res.end();
  } catch (error) {
    logger.error(error);

    let errorCode = error.status || SERVER_ERROR;
    let errorMessage = error.status ? error.message : INTERNAL_ERROR;

    const serverError = error.response && error.response.data;

    if (serverError && error.response.statusText === identityErrorCodes.INVALID_CODE) {
      errorCode = NOT_ACCEPTABLE;
      errorMessage = INVALID_CODE;
    }

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

async function verifyMobileNumber(req, res) {
  try {
    const { otp } = req.body;
    const { username, tenantId } = req.user;

    const user = await findPersonaByUsername(username);
    const accountPhoneNumber = user.phoneNumbers.find((phoneNumber) => phoneNumber.isAccount);

    if (!isEmpty(accountPhoneNumber) && accountPhoneNumber.isVerified) {
      logger.error(util.format('Phone number [%s] already verified', accountPhoneNumber.number));

      throw makeError(FORBIDDEN_ACTION_PHONE_NUMBER_VERIFIED, FORBIDDEN);
    }

    await verifyOtp(user.id, otp, globalSettings.OTP_VALIDITY_IN_MINUTES, tenantId);

    user.phoneNumbers.find((num) => num.isAccount).isVerified = true;

    await updateUserAttributes(
      user.id,
      {
        ...user.attributes,
        otp: [],
        isOtpVerified: [],
        otpCreationDate: [],
        isPhoneVerified: true,
      },
      tenantId,
    );

    await updatePersonaById(user.id, { phoneNumbers: user.phoneNumbers });
    res.statusCode = SUCCESS_NO_CONTENT;
    res.end();
  } catch (error) {
    const loggerMessage = error.response ? error.response.data : error;
    logger.error(util.format('Failed to verify mobile number. Error message: [%s]', loggerMessage));

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

module.exports = { verifyEmail, verifyMobileNumber };
