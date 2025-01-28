const { SERVER_ERROR } = require('../utils/server-codes');
const errorsDescriptions = require('../utils/server-messages-descriptions');

const logger = require('../../lib/utils/logger').Logger;

function makeError(message, status) {
  const error = new Error();
  error.status = status;
  error.message = message;
  error.errorDescription = `${message} : ${errorsDescriptions[status]?.description}`;

  return error;
}

function propagateError(next) {
  return (error) => {
    let err = error;
    let message;
    let status = error.status || SERVER_ERROR;
    err.status = status;
    if (error.response) {
      if (error.response.body.message) {
        status = error.response.body.status || SERVER_ERROR;
        [message] = error.response.body;
      } else {
        [status] = error.response;
        message = error.response.body;
      }

      err = makeError(message, status);
    }

    switch (status) {
      case SERVER_ERROR: {
        logger.error(`${err}`);
        logger.error(`Error (stacktrace) >${err.stack}`);
        break;
      }

      default: {
        break;
      }
    }

    next(err);
  };
}

module.exports = {
  makeError,
  propagateError,
};
