const customAxios = require('../../utils/axiosInterceptor');
const { IS_TENANTS } = require('../../config/globals');

const { IS_BASE_URL } = process.env;

function verifyEmail(code, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/admin/realms/${tenantKey}/users/${code}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  const data = {
    emailVerified: true,
    requiredActions: [],
  };

  const options = {
    method: 'PUT',
    headers,
    data,
    url,
  };

  return customAxios(options);
}

module.exports = { verifyEmail };
