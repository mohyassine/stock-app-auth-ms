const { isEmpty } = require('lodash');
const { makeError } = require('../../errors/utils');
const { updateProfileById, findProfileById, updatePersonaByPersonaId } = require('../../services');
const logger = require('../../utils/logger').Logger;
const {
  NOT_FOUND,
  SERVER_ERROR,
  SUCCESS_NO_CONTENT,
  SUCCESS,
} = require('../../utils/server-codes');
const { NOT_FOUND_PROFILE, INTERNAL_ERROR } = require('../../utils/server-messages');
const { disableISUserById } = require('../../services/brokers');
const { PERSONA_STATUS } = require('../../config/globals');
const { findPersonaByPersonaId } = require('../../services/persona/find');

async function updateUserProfile(req, res) {
  try {
    const data = req.body;
    const { profileId } = req.params;
    const userProfile = await findProfileById(profileId);

    if (isEmpty(userProfile)) {
      logger.error(`User with profile id [${profileId}] not found`);
      throw makeError(NOT_FOUND_PROFILE, NOT_FOUND);
    }

    logger.info(`Updating broker profile info for [${profileId}]`);

    await updateProfileById(profileId, data);

    res.statusCode = SUCCESS_NO_CONTENT;
    res.send();
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

const updatePersona = async (req, res) => {
  try {
    const { personaId } = req.params;
    const data = req.body;
    const updatedPersona = await updatePersonaByPersonaId(personaId, data);
    res.statusCode = SUCCESS;
    res.send(updatedPersona);
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
};

const activateDeactivateUser = async (req, res) => {
  try {
    const { personaId } = req.params;
    const { deactivate } = req.body;
    const { tenantId } = req.user;
    const persona = await findPersonaByPersonaId(personaId);
    const response = await disableISUserById(persona.id, tenantId, deactivate);

    let updatedPersona;
    if (response) {
      const data = { status: deactivate ? PERSONA_STATUS.DEACTIVATED : PERSONA_STATUS.ACTIVE };
      updatedPersona = await updatePersonaByPersonaId(personaId, data);
    }
    res.statusCode = SUCCESS;
    res.send(updatedPersona);
  } catch (error) {
    logger.error(error);
    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;
    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
};

module.exports = { updateUserProfile, updatePersona, activateDeactivateUser };
