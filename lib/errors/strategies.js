const { ValidationError } = require('express-validation');

const { Logger: logger } = require('../utils/logger');
const { SERVER_ERROR } = require('../utils/server-codes');
const { VALIDATION_ERROR } = require('../utils/server-messages');
const errorsDescriptions = require('../utils/server-messages-descriptions');

const defaultStrategy = function (err, req, res, next) {
  if (res.headersSent) {
    logger.warn('[ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client');
    next(err);
    return;
  }

  let code = err.status || SERVER_ERROR;
  const { message } = err;

  let responseData = {
    status: code,
    message,
    errorDescription: `${message} : ${errorsDescriptions[code]?.description}`,
  };

  if (err instanceof ValidationError) {
    logger.error(JSON.stringify(err.details));

    code = err.statusCode;
    responseData = {
      status: code,
      message: VALIDATION_ERROR,
      errorDescription: `${VALIDATION_ERROR} : ${errorsDescriptions[code]?.description}`,
    };
  }

  res.status(code);
  res.set('Content-Type', 'application/json');
  res.send(responseData);
  next(err);
};

module.exports = {
  defaultStrategy,
};
