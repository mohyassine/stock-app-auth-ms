/* eslint-disable no-param-reassign */
const axios = require('axios');
const chalk = require('chalk');
const logger = require('../utils/logger').Logger;

const registerAxiosInterceptors = () => {
  axios.interceptors.request.use((x) => {
    // to avoid overwriting if another interceptor
    // already defined the same object (meta)
    x.meta = x.meta || {};
    x.meta.requestStartedAt = new Date().getTime();
    return x;
  });

  axios.interceptors.response.use(
    (x) => {
      const {
        config: {
          url,
          meta: { requestStartedAt },
        },
      } = x;

      const printedUrl = `${url} - ${new Date().getTime() - requestStartedAt} ms`;
		
		    logger.info(chalk.blue(printedUrl));

      return x;
    },
    // Handle 4xx & 5xx responses
    (x) => {
      logger.error(
        chalk.red(`${x.config.url} - ${new Date().getTime() - x.config.meta.requestStartedAt} ms`),
      );
      throw x;
    },
  );
};

module.exports = {
  registerAxiosInterceptors,
};
