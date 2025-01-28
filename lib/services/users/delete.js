const axios = require('../../utils/axios');
const { IS_TENANTS } = require('../../config/globals');

const { IS_BASE_URL } = process.env;

function deleteUserById(userId, tenantId) {
  const IS_ADMIN_CLIENT_ID = JSON.parse(process.env.IS_ADMIN_CLIENT_ID);
  const IS_ADMIN_CLIENT_SECRET = JSON.parse(process.env.IS_ADMIN_CLIENT_SECRET);

  const { urlPrefix, key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}${urlPrefix}/scim2/Users/${userId}`;
  const headers = {
    Accept: 'application/scim+json',
  };
  const auth = {
    username: IS_ADMIN_CLIENT_ID[tenantKey],
    password: IS_ADMIN_CLIENT_SECRET[tenantKey],
  };

  const options = {
    method: 'DELETE',
    headers,
    auth,
    url,
  };

  return axios(options);
}

module.exports = { deleteUserById };
