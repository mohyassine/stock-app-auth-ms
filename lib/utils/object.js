const objectHasValue = (object, value) => !!Object.values(object).find((v) => v === value);

// This function will stringify an object with indentation of 2 spaces. Usefull
// when you want to console log an object with many nestered properties
const logObject = (object) => JSON.stringify(object, null, 2);

module.exports = {
  objectHasValue,
  logObject,
};
