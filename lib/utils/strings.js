const { isNil, isNumber } = require('lodash');

const getFirstLetter = (string) => string?.[0] || '';

const isJSONString = (string) => {
  if (isNil(string)) {
    return false;
  }
  try {
    JSON.parse(string.trim().replace(/\u00A0/g, ''));
    return true;
  } catch (error) {
    return false;
  }
};

const numberToWords = (number, currency, onlyPosition = 'left') => {
  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
  const teens = [
    '',
    'ELEVEN',
    'TWELVE',
    'THIRTEEN',
    'FOURTEEN',
    'FIFTEEN',
    'SIXTEEN',
    'SEVENTEEN',
    'EIGHTEEN',
    'NINETEEN',
  ];
  const tens = [
    '',
    'TEN',
    'TWENTY',
    'THIRTY',
    'FORTY',
    'FIFTY',
    'SIXTY',
    'SEVENTY',
    'EIGHTY',
    'NINETY',
  ];

  const numberToString = (num) => {
    if (num === 0) return '';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`;
  };

  const toWords = (num) => {
    let n = num; // Create a new variable to hold the modified value

    if (n === 0) return 'ZERO';

    let words = '';
    if (n >= 1000000) {
      words += `${toWords(Math.floor(n / 1000000))} MILLION `;
      n %= 1000000;
    }
    if (n >= 1000) {
      words += `${toWords(Math.floor(n / 1000))} THOUSAND `;
      n %= 1000;
    }
    if (n >= 100) {
      words += `${toWords(Math.floor(n / 100))} HUNDRED `;
      n %= 100;
    }
    if (n > 0) {
      if (words !== '') words += 'AND ';
      words += numberToString(n);
    }
    return words;
  };

  const numberString = isNumber(number) ? number.toString() : number;
  const parsedNumber = parseFloat(numberString.replace(/,/g, ''));

  const dollars = Math.floor(parsedNumber);
  const cents = Math.round((parsedNumber - dollars) * 100);
  const dollarsWords = toWords(dollars);

  const getCentsSentence = () => {
    if (cents === 0) {
      return ' ';
    }

    if (cents < 10) {
      return ` & 0${cents}/100 `;
    }

    return ` & ${cents}/100 `;
  };
  return `${onlyPosition === 'left' ? `ONLY ` : ''}${dollarsWords}${getCentsSentence()}${currency}${
    onlyPosition === 'right' ? ' ONLY.' : ''
  }`;
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
};

module.exports = {
  getFirstLetter,
  isJSONString,
  numberToWords,
  parseBoolean,
};
