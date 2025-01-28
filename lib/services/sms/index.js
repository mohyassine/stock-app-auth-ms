const axios = require('../../utils/axios');
const logger = require('../../utils/logger').Logger;

const { NOTIFICATION_BASE_URL, NOTIFICATION_ACCEPT_HEADER } = process.env;

const sendSms = async (
  tenantId,
  phoneNumber,
  type = undefined,
  smsData = undefined,
  message = undefined,
  language = 'EN',
) => {
  const url = `${NOTIFICATION_BASE_URL}/sms`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: NOTIFICATION_ACCEPT_HEADER,
    'X-TENANT-PLATFORM': tenantId,
  };

  let data;
  if (smsData) {
    data = {
      phoneNumber,
      language,
      data: smsData,
    };
  } else {
    data = {
      phoneNumber,
      language,
      message,
    };
  }

  const params = { type };

  const options = {
    method: 'POST',
    headers,
    params,
    data,
    url,
  };

  try {
    const response = await axios(options);

    return response;
  } catch (error) {
    logger.error('An error occurred while sending SMS', error);
    return { error: 'Failed to send SMS' };
  }
};

module.exports = { sendSms };
