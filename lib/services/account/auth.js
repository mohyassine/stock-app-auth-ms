const qs = require('qs');
const axios = require('axios');
const customAxios = require('../../utils/axiosInterceptor');

const { IS_TENANTS } = require('../../config/globals');

const { ENV, IS_BASE_URL } = process.env;

async function signIn(username, password, tenantId) {
  const IS_ADMIN_CLIENT_ID = JSON.parse(process.env.IS_ADMIN_CLIENT_ID);
  const IS_ADMIN_CLIENT_SECRET = JSON.parse(process.env.IS_ADMIN_CLIENT_SECRET);

  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/realms/${tenantKey}/protocol/openid-connect/token`;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const data = {
    grant_type: 'password',
    client_id: IS_ADMIN_CLIENT_ID[tenantKey],
    client_secret: IS_ADMIN_CLIENT_SECRET[tenantKey],
    username,
    password,
  };
		
  const options = {
    method: 'POST',
    headers,
    data: qs.stringify(data),
    url,
  };

  return axios(options);
}

async function signUp({ firstName, lastName, username, email, password, tenantId }) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/admin/realms/${tenantKey}/users`;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  const data = {
    username,
    firstName,
    lastName,
    email,
    enabled: true,
    credentials: [
      {
        type: 'password',
        temporary: false,
        value: password,
      },
    ],
    requiredActions: ['VERIFY_EMAIL'],
  };

  const options = {
    method: 'POST',
    headers,
    data,
    url,
  };

  return customAxios(options);
}

async function sendUserInvite(userId, isEmployee, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/realms/${tenantKey}/user-management/send-invitation-email`;
		
  const headers = {
    'Content-Type': 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
    environment: ENV,
  };

  const options = {
    method: 'POST',
    headers,
    url,
    data: {
      userId,
      isEmployee,
    },
  };
  return customAxios(options);
}

module.exports = { signIn, signUp, sendUserInvite };
