const trim = require('lodash/trim');
const isNumber = require('lodash/isNumber');

const moment = require('moment');
const momentTimezone = require('moment-timezone');
const { globalSettings } = require('../config/settings');
const { isGenericValueEmpty } = require('./generic-validation');
const { iso8601Regex } = require('./regex');

/**
 *
 * @param {*} date1
 * @param {*} date2
 * @param {import('moment').unitOfTime.Diff} diffUnitOfTime - accepts value of type unitOfTime.Diff of moment (ex: days|hours|...)
 * @returns
 */
const calculateDateDiff = (date1, date2, diffUnitOfTime = 'milliseconds') => {
  const d1 = moment(date1);
  const d2 = moment(date2);

  return d1.diff(d2, diffUnitOfTime);
};

function isDateExpired(date, expiryDate) {
  return moment(date).isAfter(moment(expiryDate));
}

function addDays(date, numOfDays) {
  return moment(date).add(numOfDays, 'days');
}

function formatDate(date) {
  return !isGenericValueEmpty(date) ? moment(date).format(globalSettings.DATE_FORMAT) : undefined;
}

function formatStringDate(date) {
  return moment(date).format('DD-MM-YYYY');
}

const calculatePastYear = (year) => moment().subtract(year, 'years').format('YYYY');

const isValidDate = (date) => {
  const str = `${parseInt(date, 10)}`;

  if (moment.isDate(date)) {
    return true;
  }
  if (isNumber(date)) {
    return false;
  }
  if (str === trim(date)) {
    return false;
  }
  if (trim(date)?.includes(' ')) {
    return false;
  }

  if (str === 'NaN') {
    return false;
  }

  return moment(date).isValid();
};

const getFirstDayOfMonth = (date) => {
  const targetMonth = moment(date).add(1, 'months');
  const firstDayOfMonth = targetMonth.startOf('month');
  return firstDayOfMonth.toDate();
};

const getLastDayOfMonth = (date, monthsToAdd = 0) => {
  const targetMonth = moment(date).add(monthsToAdd, 'months');
  const lastDayOfMonth = targetMonth.endOf('month');
  return lastDayOfMonth.toDate();
};

const setDateTimeToMidnight = (date) => {
  const formattedDate = moment(date);
  formattedDate.startOf('day');
  return moment(formattedDate.format());
};

const hasDatePassed = (date) =>
  isDateExpired(setDateTimeToMidnight(new Date()), setDateTimeToMidnight(date));

const isISODate = (dateString) => iso8601Regex.test(dateString);

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};
const getDateInUTC = ({ date = null, format = '', shouldFormat = true } = {}) => {
  const today = date ? moment.utc(date) : moment.utc();

  if (shouldFormat) {
    return format ? today.format(format) : today.format();
  }

  return today;
};

const getDayOfWeek = (dateString) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
};

const getTimeInTimezone = (date, timezone) => momentTimezone(date).tz(timezone).format('HH:mm:ss');

module.exports = {
  formatStringDate,
  calculateDateDiff,
  formatDate,
  isDateExpired,
  addDays,
  calculatePastYear,
  isValidDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  hasDatePassed,
  isISODate,
  calculateAge,
  getDateInUTC,
  getDayOfWeek,
  getTimeInTimezone,
};
