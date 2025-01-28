const { isNil } = require('lodash');

const isGenericValueEmpty = (value) => isNil(value) || value === '';

module.exports = {
  isGenericValueEmpty,
};
