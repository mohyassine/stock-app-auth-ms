const querystring = require('querystring');

const axios = require('../../utils/axios');
const { IS_TENANTS } = require('../../config/globals');
const { getTenantIdFromJwt } = require('../../utils/iam');

const { IS_BASE_URL } = process.env;

async function validateToken(token) {
  const IS_ADMIN_CLIENT_ID = JSON.parse(process.env.IS_ADMIN_CLIENT_ID);
  const IS_ADMIN_CLIENT_SECRET = JSON.parse(process.env.IS_ADMIN_CLIENT_SECRET);

  const data = {
    token,
  };

  const tenantId = getTenantIdFromJwt(token);
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: IS_ADMIN_CLIENT_ID[tenantKey],
      password: IS_ADMIN_CLIENT_SECRET[tenantKey],
    },
    data: querystring.stringify(data),
    url: `${IS_BASE_URL}/auth/realms/${tenantKey}/protocol/openid-connect/token/introspect`,
  };

  return axios(options);
}

module.exports = { validateToken };
