const { isEmpty } = require('lodash');

const { makeError } = require('../../errors/utils');
const customAxios = require('../../utils/axiosInterceptor');
const { IS_TENANTS } = require('../../config/globals');
const { findUsersBy } = require('../users/profile');

const { INVALID_REQUEST } = require('../../utils/server-messages');
const { NOT_ACCEPTABLE } = require('../../utils/server-codes');

const { ENV = 'dev', IS_BASE_URL } = process.env;

async function sendAccountConfirmationEmail(username, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const response = await findUsersBy('username', username, tenantId);

  const user = response.data.find((usr) => usr.username === username.toLowerCase());

  if (isEmpty(user)) {
    throw makeError(INVALID_REQUEST, NOT_ACCEPTABLE);
  }

  const url = `${IS_BASE_URL}/auth/realms/${tenantKey}/user-management/send-verify-email?userId=${user.id}`;
  const headers = {
    Authorization: response.config.headers.Authorization,
    tenantId: tenantKey,
    environment: ENV,
    'Content-Type': 'application/json',
  };

  const options = {
    method: 'POST',
    headers,
    url,
  };

  return customAxios(options);
}

module.exports = { sendAccountConfirmationEmail };
