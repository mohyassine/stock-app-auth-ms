function fuzzySearchRegExp(str) {
  const removedSpecialCharacters = str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '');
  const phraseStr = removedSpecialCharacters.replace(' ', '|');
  const pattern = `.*${phraseStr.split('').join('.*')}.*`;
  const regex = new RegExp(pattern, 'gi');

  return regex;
}

const alphaNumericWithAllowedSpecialCharactersRegExp = (
  allowedSpecialCharacters = [],
  mode = null,
) => {
  let alphaNumericCharacters = 'a-zA-Z0-9';

  if (mode === 'uppercase') {
    alphaNumericCharacters = 'A-Z0-9';
  } else if (mode === 'lowercase') {
    alphaNumericCharacters = 'a-z0-9';
  }

  const allowedSpecialCharactersString = allowedSpecialCharacters.join('');

  return new RegExp(`[${alphaNumericCharacters}${allowedSpecialCharactersString}]+`);
};

/**
 * Adds word boundaries to a given regular expression.
 *
 * @param {RegExp} regex - The original regular expression.
 * @param {string} [flags] - Optional. Custom flags for the new regular expression.
 * @returns {RegExp} - New regular expression with word boundaries.
 */
const addBoundaryToRegExp = (regex, flags = '') => {
  const regexString = regex.source;
  const regexFlags = regex.flags;
  const regexWithBorder = new RegExp(`\\b${regexString}\\b`, flags || regexFlags);
  return regexWithBorder;
};

/**
 * Adds start and end of line anchors to a given regular expression.
 *
 * @param {RegExp} regex - The original regular expression.
 * @param {string} [flags] - Optional. Custom flags for the new regular expression.
 * @returns {RegExp} - New regular expression with start and end of line anchors.
 */
const addStartAndEndOfLineToRegExp = (regex, flags = '') => {
  const regexString = regex.source;
  const regexFlags = regex.flags;
  const regexWithAnchors = new RegExp(`^${regexString}$`, flags || regexFlags);
  return regexWithAnchors;
};

const usernameRevertedRegExp = /[!@#$%^&*()+=[\]{};':"\\|,<>/?]+/;
const noSpecialCharactersRevertedRegExp = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
const someSpecialCharactersRevertedRegExp = /[!@#$%^&*()+=[\]{};:"\\|<>/?]+/;
const spaceRegExp = / /g;

const emiratesRegExp =
  /\b(ABU DHABI|DUBAI|SHARJAH?|AJMAN|UMM AL QUWAIN|RAS AL KHAIMAH?|FUJAIRAH?)\b/i;

// addresses common OCR errors in the Emirates ID
const ocrEmiratesRegExp =
  /(ABU DHABI|DUBAI|SHAR?JA?H?|AJMAN|UMM AL QU?WAI?N|RAS AL KHA?IMA?H?|FUJAIRA?H?)/i;

const endWithEmiratesRegExp =
  /^(ABU DHABI|DUBAI|SHARJAH?|AJMAN|UMM AL QUWAIN|RAS AL KHAIMAH?|FUJAIRAH?)$/;
const startsWithYearRegExp = /^\d{4}/;
const iso8601DateRegExp =
  /\b(?:\d{1,2}\s*[-\\/]\s*\d{1,2}\s*[-\\/]\s*\d{4}|(\d{4})\s*[-\\/]\s*\d{1,2}\s*[-\\/]\s*\d{1,2})\b/g;
const monthAbbreviatedDateRegExp = /\b(?:\d{1,2}\s*[-\\/]\s*[A-Z]{3}\s*[-\\/]\s*\d{2})\b/gi;
const emirateIdDocumentIdNumberRegex = /\b784-\d{4}-\d{7}\b/;
const creditCardRegex = /.(?=.{4,}$)/g;

const numbersBelow100RegExp = /[1-9][0-9]?/g;
const numericOnlyRegExp = /\d+/g;
const alphabetsOnlyRegExp = /[a-zA-Z]+/g;
const chassisNumberRegExp = /[A-HJ-NPR-Z0-9]{17}/;

const yearRegExp = /\b(19\d{2}|20\d{2})\b/g;

// Also allow YYYY-MM-DD format
const iso8601Regex = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$/;

const rtfDynamicFieldRegExp = /<\/@([^>]+)>/g; // format of dynamic fields in rtf content: </@FIELD_NAME>

const emiratePlateNumberRegExp = /[A-Z]{1,5}[\s\\/]*[0-9]{1,5}/g;

const lowercaseRegExp = /[a-z]/g;
const uppercaseRegExp = /^[A-Z]+$/;

const vinNumberRegex = /[A-Z\d]{17}/g;

const carValueRegex = /[\d,]+[.?\d*]*/g;

const nameRegex = /(((?!.*(Date of Birth|Nationality))[A-Za-z]+\s)+)/g;

const endpointRegex = { share_quotation: /^\/\d+\/quotations\/[a-f0-9-]+\/share$/ };

const onlyLetterRegex = /\b\w\b/g;

const onlyNumbersRegex = /\d+/g;

const splitFunctionRegex = /.*<split:(.*):(\d):(\d)>/;

// capital, minimum of 2 characters, at least two words unless onlyOneWord is true
const getFullNameRegex = (onlyOneWord = false) =>
  onlyOneWord ? /\b[A-Z][a-zA-Z'-]{1,}\b/ : /\b[A-Z][a-zA-Z'-]{1,}(?:[\s-][A-Z][a-zA-Z'-]{1,})+\b/;

module.exports = {
  fuzzySearchRegExp,
  alphaNumericWithAllowedSpecialCharactersRegExp,
  addBoundaryToRegExp,
  addStartAndEndOfLineToRegExp,
  chassisNumberRegExp,
  creditCardRegex,
  usernameRevertedRegExp,
  noSpecialCharactersRevertedRegExp,
  someSpecialCharactersRevertedRegExp,
  spaceRegExp,
  emirateIdDocumentIdNumberRegex,
  numbersBelow100RegExp,
  numericOnlyRegExp,
  alphabetsOnlyRegExp,
  emiratesRegExp,
  endWithEmiratesRegExp,
  iso8601DateRegExp,
  yearRegExp,
  iso8601Regex,
  startsWithYearRegExp,
  rtfDynamicFieldRegExp,
  emiratePlateNumberRegExp,
  lowercaseRegExp,
  vinNumberRegex,
  carValueRegex,
  nameRegex,
  endpointRegex,
  monthAbbreviatedDateRegExp,
  onlyLetterRegex,
  onlyNumbersRegex,
  splitFunctionRegex,
  getFullNameRegex,
  uppercaseRegExp,
  ocrEmiratesRegExp,
};
