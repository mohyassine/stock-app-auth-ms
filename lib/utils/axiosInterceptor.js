const axios = require('axios');
const https = require('https');
const NodeCache = require('node-cache');

const logger = require('../utils/logger').Logger;
const { getTokenFromAdminCredentials } = require('./iam');

const myCache = new NodeCache();

const customAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const requestHandler = async (request) => {
  // read token from cache
  let token = myCache.get(`token${request.headers.tenantId}`);
  if (token) {
    logger.info('Token found in memory cache');
    request.headers.Authorization = token;
  } else {
    logger.info('No token found in cache, getting a new one...');
    token = await getTokenFromAdminCredentials(request.headers.tenantId);

    request.headers.Authorization = `Bearer ${token}`;
    // store token in cache
    myCache.set(`token${request.headers.tenantId}`, `Bearer ${token}`);
  }
  return request;
};

const responseHandler = (response) => response;

const errorHandler = async (error) => {
  const status = error.response ? error.response.status : null;

  if (status === 401) {
    logger.info('Token expired, getting new one');
    const token = await getTokenFromAdminCredentials(error.config.headers.tenantId);
    // store new token in cache
    myCache.set(`token${error.config.headers.tenantId}`, `Bearer ${token}`);

    logger.info('New token stored in memory cache');
    // eslint-disable-next-line no-param-reassign
    error.config.headers.Authorization = `Bearer ${token}`;
    return customAxios.request(error.config);
  }
  return Promise.reject(error);
};

customAxios.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error),
);

customAxios.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error),
);

module.exports = customAxios;
