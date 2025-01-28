const axios = require('axios');
const https = require('https');
const { isEmpty } = require('lodash');
const qs = require('qs');

const logger = require('../utils/logger').Logger;
const { makeError } = require('../errors/utils');
const { ACTION_ROLES, IS_TENANTS } = require('../config/globals');
const { getTenantIdFromJwt } = require('../utils/iam');
const { UNAUTHORIZED, SUCCESS } = require('../utils/server-codes');
const {
  UNAUTHORIZED: UNAUTHORIZED_USER,
  NOT_FOUND_USER,
  INVALID_TOKEN,
} = require('../utils/server-messages');

const {
  findProfilesByPersonaId,
  getPersonaByIsId,
} = require('../services');

const { IS_BASE_URL } = process.env;

async function authenticateUser(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const tenantId = getTenantIdFromJwt(token);
    const { key } = IS_TENANTS[tenantId.toUpperCase()];

    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: `${IS_BASE_URL}/auth/realms/${key}/protocol/openid-connect/userinfo`,
    };

    const result = await instance(options);

    const userInfo = result.data;

    const userId = userInfo.sub;

    const userPersona = await getPersonaByIsId(userId);
    const userProfiles = await findProfilesByPersonaId(userId);

    // TODO: to read the current user's profile from a request header
    const defaultProfile = userProfiles[0];
    const companyPersona = {};

    if (!isEmpty(defaultProfile)) {
      defaultProfile.actions = [];
    }

    req.user = {
      ...userPersona,
      profile: defaultProfile,
      companyPersona,
      actionRoles: ACTION_ROLES,
    };

    if (isEmpty(req.user)) throw makeError(NOT_FOUND_USER);

    req.user.userid = userId; // IS id as fallback
    req.user.tenantId = tenantId?.toUpperCase();

    res.statusCode = SUCCESS;
    res.response = result;
    next();
  } catch (error) {
    logger.error(error);
    res.statusCode = UNAUTHORIZED;
    res.send(makeError(UNAUTHORIZED_USER, UNAUTHORIZED));
  }
}

async function validateToken(req, res, next) {
  try {
    const IS_ADMIN_CLIENT_ID = JSON.parse(process.env.IS_ADMIN_CLIENT_ID);
    const IS_ADMIN_CLIENT_SECRET = JSON.parse(process.env.IS_ADMIN_CLIENT_SECRET);

    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    const data = {
      token: req.headers.authorization.split(' ')[1],
    };

    const tenantId = getTenantIdFromJwt(data.token);
    const { key } = IS_TENANTS[tenantId.toUpperCase()];

    const reqData = {
      client_id: IS_ADMIN_CLIENT_ID[tenantId],
      client_secret: IS_ADMIN_CLIENT_SECRET[tenantId],
      token: data.token,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: `${IS_BASE_URL}/auth/realms/${key}/protocol/openid-connect/token/introspect`,
      data: qs.stringify(reqData),
    };

    const result = await instance(options);

    if (!result.data.active) throw makeError(INVALID_TOKEN, UNAUTHORIZED);

    res.statusCode = SUCCESS;
    res.response = 'ok';
    next();
  } catch (error) {
    logger.error(error);
    res.statusCode = UNAUTHORIZED;
    res.send(makeError(UNAUTHORIZED_USER, UNAUTHORIZED));
  }
}

module.exports = { authenticateUser, validateToken };
