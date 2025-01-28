const axios = require('../../utils/axios');

const { STRINGS } = require('../../../lib/config/strings');

const { NOTIFICATION_BASE_URL, NOTIFICATION_ACCEPT_HEADER } = process.env;

const { BROKER_APPROVAL_TRUE, BROKER_APPROVAL_FALSE } = STRINGS;

const sendBrokerApprovalEmail = (
  email,
  tenantId,
  firstName,
  lastName,
  approval,
  reasonText,
  redirectUrl,
) => {
  const status = approval ? BROKER_APPROVAL_TRUE : BROKER_APPROVAL_FALSE;
  const url = `${NOTIFICATION_BASE_URL}/email?type=brokerApplicationStatus`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: NOTIFICATION_ACCEPT_HEADER,
  };

  const data = {
    recipients: [email],
    data: {
      status,
      reason: reasonText,
      tenantId,
      firstName,
      lastName,
      redirectUrl,
    },
  };

  const options = {
    method: 'POST',
    headers,
    data,
    url,
  };

  axios(options);
};

module.exports = { sendBrokerApprovalEmail };
