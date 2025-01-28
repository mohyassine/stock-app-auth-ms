const axios = require('../../../utils/axios');
const customAxios = require('../../../utils/axiosInterceptor');
const { IS_TENANTS } = require('../../../config/globals');

const { IS_BASE_URL } = process.env;

function recoverPasswordByEmailOTP(userId, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/admin/realms/${tenantKey}/users/${userId}/execute-actions-email`;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  const data = ['UPDATE_PASSWORD'];

  const options = {
    method: 'PUT',
    headers,
    data,
    url,
  };

  return customAxios(options);
}

function setPreferredChannel(channelId, recoveryCode, tenantId) {
  const IS_ADMIN_CLIENT_ID = JSON.parse(process.env.IS_ADMIN_CLIENT_ID);
  const IS_ADMIN_CLIENT_SECRET = JSON.parse(process.env.IS_ADMIN_CLIENT_SECRET);

  const { urlPrefix, key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}${urlPrefix}/api/users/v1/recovery/password/recover`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const auth = {
    username: IS_ADMIN_CLIENT_ID[tenantKey],
    password: IS_ADMIN_CLIENT_SECRET[tenantKey],
  };
  const data = {
    recoveryCode,
    channelId,
    properties: [
      {
        key: 'key',
        value: 'value',
      },
    ],
  };

  const options = {
    method: 'POST',
    headers,
    auth,
    data,
    url,
  };

  return axios(options);
}

function resetPassword(userId, password, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/admin/realms/${tenantKey}/users/${userId}/reset-password`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  const data = {
    value: password,
  };

  const options = {
    method: 'PUT',
    headers,
    data,
    url,
  };

  return customAxios(options);
}

module.exports = {
  recoverPasswordByEmailOTP,
  resetPassword,
  setPreferredChannel,
};
