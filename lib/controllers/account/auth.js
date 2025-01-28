const { isEmpty } = require('lodash');
const { makeError } = require('../../errors/utils');
const { errorCodes: identityErrorCodes, getUserIdFromJwt } = require('../../utils/iam');
const { PLATFORM_PERSONA_TYPES } = require('../../db/enums');

const {
  USER_EXISTS,
  INTERNAL_ERROR,
  NOT_FOUND_USER,
  VERIFICATION_REQUIRED,
  VALIDATION_ERROR,
  LOGIN_ATTEMPTS_EXCEEDED,
  USER_DEACTIVATED,
  UNAUTHORIZED,
} = require('../../utils/server-messages');

const {
  LOCKED,
  SUCCESS,
  FORBIDDEN,
  SERVER_ERROR,
  SUCCESS_CREATED,
  BAD_REQUEST,
  CONFLICT,
} = require('../../utils/server-codes');

const {
  createByTypePersona,
  findPersonaByUsername,
  findProfilesByPersonaId,
  signIn: signInService,
  signUp: signUpService,
  findUserBy,
  sendAccountConfirmationEmail,
  updatePersonaByPersonaId,
} = require('../../services');

const { updatePersonaUserIdByUsername } = require('../../services/persona/update');
const { PERSONA_STATUS, ACTION_ROLES } = require('../../config/globals');

const logger = require('../../utils/logger').Logger;

async function register(req, res) {
  try {
    const { firstName, lastName, email, password, username } = req.body;
    const tenantId = req.header('x-tenant-platform');

    await signUpService({
      firstName,
      lastName,
      email,
      password,
      username,
      tenantId,
    });

    const user = await findUserBy('email', email, tenantId);

    const userIsData = {
      ...req.body,
      id: user.id,
      emails: [{ email, isAccount: true }],
    };

    delete userIsData.email;
    delete userIsData.password;

    await createByTypePersona(PLATFORM_PERSONA_TYPES.INDIVIDUAL, userIsData, tenantId);
    sendAccountConfirmationEmail(username, tenantId);

    res.statusCode = SUCCESS_CREATED;
    res.end();
  } catch (error) {
    const logMessage = error.response
      ? JSON.stringify({
          status: error.response.status,
          message: error.response.data,
        })
      : error;
    logger.error(logMessage);

    let errorCode = error?.response?.status || SERVER_ERROR;
    let errorMessage = error.status ? error.message : INTERNAL_ERROR;

    const serverError = error.response && error.response.data;

    if (serverError && error.response.status === identityErrorCodes.CONFLICT) {
      errorCode = CONFLICT;
      errorMessage = USER_EXISTS;
    } else if (
      serverError &&
      error.response.data.errorMessage === identityErrorCodes.PASSWORD_POLICY_VIOLATION
    ) {
      logger.error('password policy violated');
      errorCode = BAD_REQUEST;
      errorMessage = VALIDATION_ERROR;
    }

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

async function signIn(req, res) {
  const { username, password } = req.body;
  try {
    const tenantId = req.header('x-tenant-platform');

    logger.info(`signIn username: ${username}`);

    const result = await signInService(username, password, tenantId);
    const accessToken = result?.data?.access_token;
    const userId = getUserIdFromJwt(accessToken);

    let userPersona = await findPersonaByUsername(username);

    if (isEmpty(userPersona)) {
      throw makeError(NOT_FOUND_USER);
    }

    if (!userPersona?.id) {
      userPersona = await updatePersonaUserIdByUsername({ username, userId });
    }

    if (isEmpty(userPersona.status)) {
      // default Persona Status
      userPersona.status = PERSONA_STATUS.INVITED;
    }

    const userProfiles = await findProfilesByPersonaId(userPersona.id);

    const userProfilesInfo = await Promise.all(
      userProfiles.map(async (profile) => ({
        id: profile.id,
        type: profile.profileType,
        roles: profile.roles,
      })),
    );

    if (userPersona.status.code === PERSONA_STATUS.INVITED.code) {
      const dataUpdate = { status: PERSONA_STATUS.ACTIVE };
      await updatePersonaByPersonaId(userPersona.personaId, dataUpdate);
    }

    const userData = {
      ...userPersona,
      profiles: userProfilesInfo,
    };

    res.statusCode = SUCCESS;

    res.json({
      data: result.data,
      userInfo: userData,
      actionRoles: ACTION_ROLES,
    });
  } catch (error) {
    logger.error(`Fail signIn username: ${username}`);
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
      errorMessage = UNAUTHORIZED;
    }
    logger.error(errorMessage);
    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

module.exports = { register, signIn };
