const isEmpty = require('lodash/isEmpty');
const { jurisdictionLines } = require('../config/settings');
const { LINE_CODE } = require('../db/enums');

function isJurisdictionLine(lineCode) {
  return jurisdictionLines.some((line) => lineCode === LINE_CODE[line]);
}

function validateEmirate(allowedZones = [], emirateOfVisaIssuance = {}) {
  return isEmpty(emirateOfVisaIssuance) || allowedZones?.includes(emirateOfVisaIssuance?.id);
}

module.exports = {
  isJurisdictionLine,
  validateEmirate,
};
