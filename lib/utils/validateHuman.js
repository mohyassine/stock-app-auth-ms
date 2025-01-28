const axios = require('axios');
const { makeError } = require('../errors/utils');
const { Logger } = require('./logger');
const { SERVER_ERROR, SUCCESS } = require('./server-codes');

const { RECAPTCHA_URL, GOOGLE_PROJECT_ID, RECAPTCHA_API_KEY, RECAPTCHA_SITE_KEY } = process.env;

const getHumanScore = async (token) => {
  const { data, status } = await axios.post(
    `${RECAPTCHA_URL}/${GOOGLE_PROJECT_ID}/assessments?key=${RECAPTCHA_API_KEY}`,
    {
      event: {
        token,
        siteKey: RECAPTCHA_SITE_KEY,
        expectedAction: 'login',
      },
    },
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const { riskAnalysis } = data;

  if (status === SUCCESS) {
    Logger.info(`reCAPTCHA score: ${riskAnalysis.score}`);
    return riskAnalysis.score;
  }
  throw makeError(data['error-codes'], SERVER_ERROR);
};

module.exports = getHumanScore;
