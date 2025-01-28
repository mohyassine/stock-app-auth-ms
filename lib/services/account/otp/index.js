const customAxios = require('../../../utils/axiosInterceptor');

const { IS_TENANTS } = require('../../../config/globals');
const { CHANNEL_TYPES } = require('../../../db/enums');

const { IS_BASE_URL} = process.env;


async function generateOtp(id, value, channel = CHANNEL_TYPES.SMS, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/realms/${tenantKey}/users/otp`;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  let data = {
    userId: id,
    otpChannel: channel,
  };

  if (channel === CHANNEL_TYPES.EMAIL) {
    data = {
      email: value,
      ...data,
    };
  } else {
    data = {
      phoneNumber: value,
      ...data,
    };
  }

  const options = {
    method: 'POST',
    headers,
    data,
    url,
  };

  return customAxios(options);
}

async function verifyOtp(id, otp, otpTtl, tenantId) {
  const { key: tenantKey } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/realms/${tenantKey}/users/otp/verification`;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: customAxios.defaults.headers.Authorization,
    tenantId: tenantKey,
  };

  const data = {
    otp,
    userId: id,
    otpTtl,
  };

  const options = {
    method: 'POST',
    headers,
    data,
    url,
  };

  return customAxios(options);
}

module.exports = { generateOtp, verifyOtp };
