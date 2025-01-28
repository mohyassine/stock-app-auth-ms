const isEmpty = require('lodash/isEmpty');
const logger = require('../../utils/logger').Logger;

const { findUserBy } = require('../../services');
const { makeError } = require('../../errors/utils');
const {
  SUCCESS,
  SERVER_ERROR,
  INTERNAL_ERROR,
  TOO_MANY_REQUESTS,
} = require('../../utils/server-codes');
const { thresholds } = require('../../config/settings');
const getHumanScore = require('../../utils/validateHuman');
const { TOO_MANY_REQUESTS_MESSAGE } = require('../../utils/server-messages');

async function validateKey(req, res) {
  try {
    let valid = false;

    const { key } = req.params;
    const { value, token } = req.body;
    const tenantId = req.header('x-tenant-platform');

    if (!isEmpty(token)) {
      const score = await getHumanScore(token);

      if (score < thresholds.humanScore) {
        throw makeError(TOO_MANY_REQUESTS_MESSAGE, TOO_MANY_REQUESTS);
      }
    }

    if (['email', 'username'].includes(key)) {
      const user = await findUserBy(key, value, tenantId);

      if (isEmpty(user)) {
        valid = true;
      }
    }

    res.statusCode = SUCCESS;
    return res.json({ valid });
  } catch (error) {
    logger.error(error);
    res.statusCode = SERVER_ERROR;
    return res.send(makeError(INTERNAL_ERROR, SERVER_ERROR));
  }
}

module.exports = { validateKey };
