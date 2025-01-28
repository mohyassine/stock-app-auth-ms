const { makeError } = require('../errors/utils');
const { SERVER_ERROR } = require('../utils/server-codes');
const { INTERNAL_ERROR } = require('../utils/server-messages');
const { cachedKeySeparators } = require('../config/settings');

const logger = require('../utils/logger').Logger;

const cache = {};

/**
 * This function will set a specific value at a specific key in the cache.
 */
const setCacheValue = (key, value) => {
  cache[key] = value;
};

/**
 * This function will get the value of the key in the cache, if it does not find
 * it, it will get the value using the valueCallback and store it cache before
 * returning it.
 * This helps a lot when there are multiple asynchronous calls to get data, storing
 * it in this cache will help cut down on asynchronous calls.
 * This eventually should be replaced with a redis instance since its much faster.
 */
const getCacheValue = async (key, valueCallback) => {
  const value = cache[key];

  if (value === undefined) {
    if (valueCallback === undefined) {
      logger.error(`Didn't find value of [${key}] in cache and valueCallback was not provided`);
      throw makeError(INTERNAL_ERROR, SERVER_ERROR);
    }
    const newValue = await valueCallback();

    cache[key] = newValue;

    return newValue;
  }

  return value;
};

const getCacheKeyByCondition = ({ key, conditionBy, conditionValue }) => {
  let combinedKey = key;

  if (conditionBy && conditionValue) {
    const { CONDITION_KEY_VALUE_SEPARATOR, KEY_CONDITION_SEPARATOR } = cachedKeySeparators;
    const conditionedCacheKeySuffix = [
      KEY_CONDITION_SEPARATOR,
      conditionBy,
      CONDITION_KEY_VALUE_SEPARATOR,
      conditionValue,
    ].join('');
    combinedKey += conditionedCacheKeySuffix;
  }

  return combinedKey;
};

module.exports = {
  getCacheValue,
  setCacheValue,
  getCacheKeyByCondition,
};
