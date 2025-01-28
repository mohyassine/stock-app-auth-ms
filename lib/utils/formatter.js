const { isEmpty, isArray, isString, isObject } = require('lodash');
const { globalSettings } = require('../config/settings');
const { ADDRESS_FIELDS } = require('../db/enums');

function hideEmailAddress(str) {
  const maskedEmailLength = globalSettings.MASKED_EMAIL_LENGTH;

  if (isEmpty(str) || !str.includes('@') || !str.includes('.')) return str;

  const [username, domainGroup] = str.split('@');
  const [domainName, domain] = domainGroup.split('.');

  const allButFirst = /(?<!^)./g;
  const allButLast = /.(?!$)/g;
  const hiddenUsername = username.replace(allButFirst, '*').substring(0, maskedEmailLength);
  const hiddenDomainName = domainName
    .replace(allButLast, '*')
    .substring(domainName.length - maskedEmailLength, domainName.length);

  const hidden = `${hiddenUsername}@${hiddenDomainName}.${domain}`;

  return hidden;
}

function hideMobileNumber(str) {
  return str.slice(0, 3) + str.slice(2).replace(/.(?=...)/g, '*');
}

const formatAddress = (addressObject, countries) => {
  if (isEmpty(addressObject)) {
    return '';
  }
  // to be replaced with code once it is added for addresses
  const nationalityCode = countries?.find(
    (country) => country?.COUNTRY_ID === addressObject.country.id,
  ).NATIONALITY_CODE;

  const addressFields =
    ADDRESS_FIELDS.find((field) => field.NATIONALITY_CODE === nationalityCode)?.FIELDS ||
    ADDRESS_FIELDS.find((field) => field.COUNTRY_DESC === 'DEFAULT').FIELDS;

  const address = [];

  addressFields.forEach((field) => {
    if (isEmpty(addressObject[field])) return null;

    if (isArray(addressObject[field])) {
      return addressObject[field].forEach((info) => address.push(info));
    }

    if (isObject(addressObject[field])) {
      return address.push(addressObject[field]?.description);
    }
    // case street or building
    if (isString(addressObject[field])) {
      return address.push(`${addressObject[field]} ${field}`);
    }
    return null;
  });

  return address.join(', ');
};

module.exports = {
  hideEmailAddress,
  hideMobileNumber,
  formatAddress,
};
