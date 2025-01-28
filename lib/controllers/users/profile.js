const isEmpty = require('lodash/isEmpty');

const { SUCCESS, SERVER_ERROR, NOT_FOUND } = require('../../utils/server-codes');

const logger = require('../../utils/logger').Logger;

const { makeError } = require('../../errors/utils');
const { INTERNAL_ERROR, NOT_FOUND_USER } = require('../../utils/server-messages');

async function getUserInfo(req, res) {
  try {
    const { user } = req;

    if (isEmpty(user)) throw makeError(NOT_FOUND_USER, NOT_FOUND);

    res.statusCode = SUCCESS;
    res.send(user);
  } catch (error) {
    const logMessage = error.response ? JSON.stringify(error.response.data) : error;
    logger.error(logMessage);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
}

module.exports = { getUserInfo };
