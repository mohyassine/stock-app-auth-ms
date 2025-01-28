const isArray = require('lodash/isArray');
const axios = require('../../utils/axios');
const logger = require('../../utils/logger').Logger;

const { NOTIFICATION_BASE_URL, NOTIFICATION_ACCEPT_HEADER } = process.env;

const sendEmail = (type, recipient, content, attachments, ccRecipients) => {
  const url = `${NOTIFICATION_BASE_URL}/email?type=${type}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: NOTIFICATION_ACCEPT_HEADER,
  };

  const data = {
    recipients: isArray(recipient) ? recipient : [recipient],
    ccRecipients,
    data: content,
    attachments,
  };

  const options = {
    method: 'POST',
    headers,
    data,
    url,
  };

  axios(options).catch((error) => {
    logger.error(
      `Could not query notification-ms. It is either down or inaccessible [${error?.response?.data?.message} ${url}].`,
    );
  });
};

module.exports = { sendEmail };
