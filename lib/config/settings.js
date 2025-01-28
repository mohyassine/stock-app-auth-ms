const globalSettings = {
  DATE_FORMAT: 'YYYY-MM-DD',
  AML_DATE_FORMAT: 'YYYY-MM-DD',
  OTP_LENGTH: 6,
  OTP_VALIDITY_IN_MINUTES: 10,
  INVITATION_OTP_VALIDITY_IN_MINUTES: 4320,
  MASKED_EMAIL_LENGTH: 5,
  HALF_A_YEAR: 6,
  TIMEZONE: 'Asia/Dubai',
};

const filterSettings = {
  maxNbrOfDimensionsAllowed: 5,
};

const usernameLength = {
  min: 8,
  max: 20,
};

const nameLength = {
  min: 2,
  max: 50,
};

const thresholds = {
  email: 5,
  phoneNumber: 5,
  humanScore: 0.5,
};

const serialNumberLength = 5;

const cachedKeySeparators = {
  KEY_CONDITION_SEPARATOR: ';',
  CONDITION_KEY_VALUE_SEPARATOR: '_',
};

const WebappRedirectionPathFrom = {
  MANAGEMENT_DECISION_REQUEST: '/proposal-details/%s',
};

const jurisdictionLines = ['HEALTH'];

const arrayFieldsWithIndexes = ['addresses', 'emails', 'phoneNumbers', 'nationalities'];
const mapArrayFieldsWithIndexSelectors = {
  addresses: 'id',
  emails: 'id',
  phoneNumbers: 'id',
  nationalities: 'nationalityId',
};

module.exports = {
  arrayFieldsWithIndexes,
  cachedKeySeparators,
  filterSettings,
  globalSettings,
  usernameLength,
  nameLength,
  mapArrayFieldsWithIndexSelectors,
  thresholds,
  serialNumberLength,
  WebappRedirectionPathFrom,
  jurisdictionLines,
};
