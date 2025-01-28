const RandExp = require('randexp');
const { spaceRegExp } = require('./regex');

function generateUsername(firstname, lastname, counter = null) {
  let username = `${firstname}${lastname}`;

  if (counter) username += counter;

  return username.replace(spaceRegExp, '');
}

function generatePassword() {
  const str = new RandExp(/^([a-z]){5}([A-Z]){3}([0-9]){3}([@$#!*&%]){1}$/).gen();
  const password = str
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');

  return password;
}

module.exports = { generatePassword, generateUsername };
