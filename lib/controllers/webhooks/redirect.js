const dotenv = require('dotenv');
const logger = require('../../utils/logger').Logger;
const { makeError } = require('../../errors/utils');
const { SERVER_ERROR } = require('../../utils/server-codes');
const { INTERNAL_ERROR } = require('../../utils/server-messages');

dotenv.config({ silent: true });

const { WEBAPP_BASE_URL } = process.env;

const redirectAfterSave = async (req, res) => {
  try {
    const { process, } = req.params;
    const { event } = req.query;

    logger.info('Redirecting...');

    res.redirect(`${WEBAPP_BASE_URL}/sign?process=${process}&event=${event}`);
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
};

module.exports = {
  redirectAfterSave,
};
