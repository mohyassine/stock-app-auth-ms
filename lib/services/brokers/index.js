const customAxios = require('../../utils/axiosInterceptor');
const { IS_TENANTS } = require('../../config/globals');

const { ENV = 'dev', IS_BASE_URL } = process.env;

function disableISUserById(userId, tenantId, isDisabled) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const enableDisable = isDisabled ? 'disable' : 'enable';

  const url = `${IS_BASE_URL}/auth/realms/${tenantKey}/user-management/${enableDisable}?userId=${userId}`;

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
  };

  return customAxios(options);
}

module.exports = { disableISUserById };
