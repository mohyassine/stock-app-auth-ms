const { isEmpty } = require('lodash');
const util = require('util');

const {
  findUserBy,
  recoverUsername: recoverUsernameService,
  resetPassword: resetPasswordService,
  getPersonaByIsId,
  generateOtp,
  verifyOtp,
  updateUserAttributes,
  sendSms,
  verifyEmail: verifyEmailService,
  findPersonaByUsername,
} = require('../../services');
const {
  NOT_ACCEPTABLE,
  NOT_FOUND,
  SUCCESS,
  SUCCESS_NO_CONTENT,
  SERVER_ERROR,
  FORBIDDEN,
  TOO_MANY_REQUESTS,
} = require('../../utils/server-codes');
const {
  INTERNAL_ERROR,
  NOT_FOUND_USER,
  NOT_FOUND_MOBILE_NUMBER,
  TOO_MANY_REQUESTS_MESSAGE,
  FORBIDDEN_ACTION_USER_PASSWORD_ALREADY_SET,
} = require('../../utils/server-messages');
const logger = require('../../utils/logger').Logger;
const { makeError } = require('../../errors/utils');
const { hideEmailAddress, hideMobileNumber } = require('../../utils/formatter');
const { CHANNEL_TYPES, EMPLOYEE_STATUS_TYPES } = require('../../db/enums');
const { SMS_TEMPLATES, EMAIL_TEMPLATES, PRODUCT_NAME } = require('../../config/globals');
const { sendEmail } = require('../../services/email/api');
const { globalSettings, thresholds } = require('../../config/settings');
const { getFullNumber } = require('../../utils/numbers');

const { findProfilesByIds } = require('../../services/profile/find');
const getHumanScore = require('../../utils/validateHuman');
const { PROFILE_TYPE_CODE } = require('../../config/dv');

async function requestPasswordRecovery(req, res) {
  try {
    const { username, isEmailChannel, token } = req.body;
    const tenantId = req.header('x-tenant-platform');
    const response = {};

    const score = await getHumanScore(token);

    if (score < thresholds.humanScore) {
      throw makeError(TOO_MANY_REQUESTS_MESSAGE, TOO_MANY_REQUESTS);
    }

    let user = await findUserBy('username', username.toLowerCase(), tenantId);

    if (isEmpty(user)) {
      throw makeError(NOT_FOUND_USER, NOT_FOUND);
    }

    user = await getPersonaByIsId(user.id);
    let otp = '';

    const hasDefaultMobileNumber =
      !isEmpty(user.phoneNumbers) && user.phoneNumbers.find((number) => number.isAccount);

    if (!hasDefaultMobileNumber && !isEmailChannel) {
      logger.info(util.format('User %s does not have a default mobile number set', user.id));
      throw makeError(NOT_FOUND_MOBILE_NUMBER, NOT_ACCEPTABLE);
    }

    if (hasDefaultMobileNumber && !isEmailChannel) {
      const mobileNumber = getFullNumber(hasDefaultMobileNumber);

      logger.info(
        util.format(
          'Mobile number found for user [%s], sending OTP by SMS to %s',
          user.id,
          mobileNumber,
        ),
      );

      otp = await generateOtp(user.id, mobileNumber, CHANNEL_TYPES.SMS, tenantId);

      const smsResponse = await sendSms(
        tenantId,
        mobileNumber,
        SMS_TEMPLATES.PASSWORD_RESET,
        { otp: otp.data.toString() },
        undefined,
      );

      if (smsResponse.status === SUCCESS_NO_CONTENT) {
        logger.info(
          util.format('OTP is sent by SMS to %s, for user with ID [%s]', mobileNumber, user.id),
        );
      }

      response.recipientAddress = hideMobileNumber(mobileNumber);
    } else {
      logger.info('Sending OTP by Email');
      const mainEmailObj = user.emails.find((email) => email.isAccount) || user.emails[0];

      otp = await generateOtp(user.id, mainEmailObj.email, CHANNEL_TYPES.EMAIL, tenantId);

      const data = {
        tenantId,
        firstName: user.firstName,
        lastName: user.lastName,
        productName: PRODUCT_NAME.NASCO_INSURANCE,
        otp: otp.data.toString(),
      };

      sendEmail(EMAIL_TEMPLATES.PASSWORD_RESET, mainEmailObj.email, data);

      logger.info(
        util.format(
          'OTP is sent by email to [%s], for user with ID [%s]',
          mainEmailObj.email,
          user.id,
        ),
      );

      response.recipientAddress = hideEmailAddress(mainEmailObj.email);
    }

    res.statusCode = SUCCESS;
    res.send(response);
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

async function passwordRecoveryVerification(req, res) {
  try {
    const { username, otp, isInvitation } = req.body;
    const tenantId = req.header('x-tenant-platform');

    const user = await findUserBy('username', username.toLowerCase(), tenantId);

    if (isEmpty(user)) {
      throw makeError(NOT_FOUND_USER, NOT_FOUND);
    }

    await verifyOtp(
      user.id,
      otp,
      isInvitation
        ? globalSettings.INVITATION_OTP_VALIDITY_IN_MINUTES
        : globalSettings.OTP_VALIDITY_IN_MINUTES,
      tenantId,
    );

    res.statusCode = SUCCESS_NO_CONTENT;
    res.end();
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

async function resetPassword(req, res) {
  try {
    const { username, newPassword } = req.body;
    const tenantId = req.header('x-tenant-platform');

    const user = await findUserBy('username', username.toLowerCase(), tenantId);

    if (isEmpty(user)) {
      throw makeError(NOT_FOUND_USER, NOT_FOUND);
    }

    if (!user.attributes?.otp) {
      throw makeError(FORBIDDEN_ACTION_USER_PASSWORD_ALREADY_SET, FORBIDDEN);
    }

    await resetPasswordService(user.id, newPassword, tenantId);

    await updateUserAttributes(
      user.id,
      { ...user.attributes, otp: [], isOtpVerified: [], otpCreationDate: [] },
      tenantId,
    );

    const userPersona = await findPersonaByUsername(username);

    const userProfiles = await findProfilesByIds({
      profileIds: userPersona?.profileIds,
      profileTypeCode: PROFILE_TYPE_CODE.BROKER,
    });

    const profileValue = userProfiles?.find(
      (userProfile) => userProfile?.employeeStatus === EMPLOYEE_STATUS_TYPES.INVITED,
    );

    if (profileValue) {
      await verifyEmailService(user.id, tenantId);
    }

    res.statusCode = SUCCESS_NO_CONTENT;
    res.end();
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

async function recoverUsername(req, res) {
  try {
    const { email, token } = req.body;
    const tenantId = req.header('x-tenant-platform');

    const score = await getHumanScore(token);

    if (score < thresholds.humanScore) {
      throw makeError(TOO_MANY_REQUESTS_MESSAGE, TOO_MANY_REQUESTS);
    }
    const user = await findUserBy('email', email, tenantId);

    if (isEmpty(user)) {
      throw makeError(NOT_FOUND_USER, NOT_FOUND);
    }

    await recoverUsernameService(email, tenantId);

    res.statusCode = SUCCESS_NO_CONTENT;
    res.end();
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

module.exports = {
  recoverUsername,
  requestPasswordRecovery,
  passwordRecoveryVerification,
  resetPassword,
};
