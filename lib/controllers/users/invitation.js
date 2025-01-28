const { isEmpty } = require('lodash');
const util = require('util');
const {
  sendUserInvitation,
  createPersonaAndProfileInitial,
  findPersonaByPrimaryEmail,
} = require('../../services');
const { SERVER_ERROR, SUCCESS, CONFLICT } = require('../../utils/server-codes');
const { INTERNAL_ERROR } = require('../../utils/server-messages');
const logger = require('../../utils/logger').Logger;
const { makeError } = require('../../errors/utils');

const { PROFILE_TYPES, STOCK_ROLES, EMPLOYEE_TYPES } = require('../../config/globals');

async function addCredentialsAndInvite(req, res) {
  try {
    const { email, firstName, lastName, type } = req.body;
    const { tenantId } = req.user;

    const { authorization } = req.headers;
    const profileTypeCode = PROFILE_TYPES.INSURED.code;
    const personaTypeCode = 'INDIVIDUAL';
    const roles = [];
    // Take Action If Entity
    // Read Only If Corporate

    if (type === EMPLOYEE_TYPES.CORPORATE) {
      roles.push(STOCK_ROLES.CORPORATE);
    } else if (type === EMPLOYEE_TYPES.ENTITY) {
      roles.push(STOCK_ROLES.ENTITY);
    }

    const userData = {
      firstName,
      lastName,
      email,
      roles,
    };

    userData.emails = [{ email, isAccount: true }];
    const existingPersonaWithSameEmail = await findPersonaByPrimaryEmail(email);

    if (!isEmpty(existingPersonaWithSameEmail)) {
      throw makeError(util.format('Email already exists'), CONFLICT);
    }
    const result = await sendUserInvitation({
      tenantId,
      userData,
    });

    if (!result.id) {
      throw makeError(
        util.format('More than 1 accounts found with [%s] as primary email', email),
        CONFLICT,
      );
    }

    const employeeData = {
      username: result.username,
      id: result.id,
      email,
      firstName,
      lastName,
      roles,
    };
    employeeData.emails = [{ email, isAccount: true }];

    const persona = await createPersonaAndProfileInitial(
      employeeData,
      profileTypeCode,
      personaTypeCode,
      {
        tenantId,
        authorization,
      },
    );
    res.statusCode = SUCCESS;
    res.send(persona);
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

module.exports = { addCredentialsAndInvite };
