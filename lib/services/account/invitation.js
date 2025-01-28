const { IS_TENANTS } = require('../../config/globals');
const customAxios = require('../../utils/axiosInterceptor');

const { IS_BASE_URL } = process.env;

async function signUpUserByInvite({ firstName, lastName, email, username, password }, tenantId) {
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
        temporary: true,
        value: password,
      },
    ],
    emailVerified: true,
  };

  const options = {
    method: 'POST',
    headers,
    data,
    url,
  };

  return customAxios(options);
}

module.exports = { signUpUserByInvite };
