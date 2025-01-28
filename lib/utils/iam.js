const axios = require('axios');
const https = require('https');

const decodeJwt = require('jwt-decode');
const qs = require('qs');

const { IS_BASE_URL } = process.env;

const { IS_TENANTS } = require('../config/globals');

const claims = Object.freeze({
  COUNTRY: 'http://wso2.org/claims/country',
  CREATED_DATE: 'http://wso2.org/claims/created',
  EMAIL_ADDRESS: 'http://wso2.org/claims/emailaddress',
  FIRST_NAME: 'http://wso2.org/claims/givenname',
  FULLNAME: 'http://wso2.org/claims/fullname',
  LAST_NAME: 'http://wso2.org/claims/lastname',
  MOBILE: 'http://wso2.org/claims/mobile',
  MODIFIED_DATE: 'http://wso2.org/claims/modified',
  ORGANIZATION: 'http://wso2.org/claims/organization',
  PREFERRED_CHANNEL: 'http://wso2.org/claims/identity/preferredChannel',
  RESOURCE_TYPE: 'http://wso2.org/claims/resourceType',
  ROLE: 'http://wso2.org/claims/role',
  URL: 'http://wso2.org/claims/url',
  USER_ID: 'http://wso2.org/claims/userid',
  USER_PRINCIPAL: 'http://wso2.org/claims/userprincipal',
  USERNAME: 'http://wso2.org/claims/username',
});

const errorCodes = Object.freeze({
  ACCOUNT_LOCKED: '17003',
  BAD_REQUEST: 400,
  INVALID_CODE: 'Not Found',
  // TODO: Update the error code for SSO disabled users [SSO_MIGRATION]
  ACCOUNT_DISABLED: '17004',
  NOT_ACCEPTED: 'UAR-10001',
  NOT_FOUND: '404',
  LOGIN_FAILED: '17002',
  VERIFICATION_REQUIRED: 'Account is not fully set up',
  CONFLICT: 409,
  PASSWORD_POLICY_VIOLATION: 'Password policy not met',
});

function getTenantIdFromJwt(token) {
  const decoded = decodeJwt(token);
  const parts = decoded.iss.split('/');

  return parts[parts.length - 1];
}

function getUserIdFromJwt(token) {
  const decoded = decodeJwt(token);
  return decoded.sub;
}

async function getTokenFromAdminCredentials(tenantId) {
  const IS_ADMIN_CLIENT_ID = JSON.parse(process.env.IS_ADMIN_CLIENT_ID);
  const IS_ADMIN_CLIENT_SECRET = JSON.parse(process.env.IS_ADMIN_CLIENT_SECRET);

  const { key } = IS_TENANTS[tenantId.toUpperCase()];

  const url = `${IS_BASE_URL}/auth/realms/${key}/protocol/openid-connect/token`;

  const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  const data = {
    grant_type: 'client_credentials',
    client_id: IS_ADMIN_CLIENT_ID[key],
    client_secret: IS_ADMIN_CLIENT_SECRET[key],
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const options = {
    method: 'POST',
    headers,
    data: qs.stringify(data),
    url,
  };

  const result = await axiosInstance(options);

  return result.data.access_token;
}

module.exports = {
  claims,
  errorCodes,
  getTenantIdFromJwt,
  getTokenFromAdminCredentials,
  getUserIdFromJwt,
};
