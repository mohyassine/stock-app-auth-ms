const util = require('util');
const winston = require('winston');
const { isEmpty } = require('lodash');

const { PROMISE_RESULT_STATUS } = require('../config/globals');

const { ENV = 'dev', LOGGING_LEVEL } = process.env;

const errorStackFormat = winston.format.printf((info) => {
  const simpleLog = `${info.level}: ${info.message}`;

  if (info.level === 'error') {
    return info?.stack || simpleLog;
  }

  return simpleLog;
});

function getWinstonLogger() {
  let format;

  switch (ENV) {
    case 'dev':
      format = winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.simple(),
        errorStackFormat,
      );
      break;
    case 'devBankers':
    case 'devAiaw':
    case 'qaBankers':
    case 'qaAiaw':
      format = winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.simple(),
        errorStackFormat,
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      );
      break;
    default:
      format = winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      );
      break;
  }

  return winston.createLogger({
    level: LOGGING_LEVEL || 'info',
    format,
    transports: [new winston.transports.Console()],
  });
}

const logErroredPromiseIfApplicable = (promiseAllSettledResults, errorTitle) => {
  const hasErrors =
    !isEmpty(promiseAllSettledResults) &&
    promiseAllSettledResults.some((result) => result.status === PROMISE_RESULT_STATUS.REJECTED);

  if (hasErrors) {
    getWinstonLogger().error(
      util.format(
        '%s returned with errors: %s',
        errorTitle,
        JSON.stringify(
          promiseAllSettledResults.map((err) => ({
            status: err.status,
            reason: {
              message: err.reason?.message,
              response: err.reason?.response?.data,
              requestData: err.reason?.response?.config?.data,
              requestUrl: err.reason?.response?.config?.url,
              ...(err.reason?.stack && { stack: err.reason.stack }),
            },
          })),
        ),
      ),
    );
  }

  return hasErrors;
};

module.exports = {
  Logger: getWinstonLogger(),
  logErroredPromiseIfApplicable,
};
