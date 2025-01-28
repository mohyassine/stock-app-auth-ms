const customAxios = require('../../../utils/axiosInterceptor');

const { IS_TENANTS } = require('../../../config/globals');

const { IS_BASE_URL } = process.env;

async function findUserBy(type, value, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/admin/realms/${tenantKey}/users?${type}=${encodeURIComponent(
    value,
  )}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  const options = {
    method: 'GET',
    headers,
    url,
  };

  const result = await customAxios(options);

  return result.data.find((user) => user[type] === value);
}

async function findUsersBy(type, value, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/admin/realms/${tenantKey}/users?${type}=${value}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  const options = {
    method: 'GET',
    headers,
    url,
  };

  return customAxios(options);
}

async function updateUserAttributes(userId, attributes, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const options = {
    method: 'PUT',
    url: `${IS_BASE_URL}/auth/admin/realms/${tenantKey}/users/${userId}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: customAxios.defaults.headers.Authorization,
      tenantId: tenantKey,
    },
    data: {
      attributes: {
        ...attributes,
      },
    },
  };

  return customAxios(options);
}

function updateUserIsProfile(userId, updateData, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/admin/realms/${tenantKey}/users/${userId}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  const options = {
    method: 'PUT',
    headers,
    data: updateData,
    url,
  };

  return customAxios(options);
}

module.exports = {
  findUserBy,
  findUsersBy,
  updateUserIsProfile,
  updateUserAttributes,
};
