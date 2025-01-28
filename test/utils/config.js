const { v4: uuidv4 } = require('uuid');

const credentials = {
  loginUser: {
    username: 'nasco.em.rep',
    password: 'Password@123',
  },
  user: {
    firstName: 'fname',
    lastName: 'lName',
    type: 'Entity',
  },
  profileTypeCode: {
    broker: 'BRK',
  },
};

function generateRandomEmail() {
  const uuid = uuidv4();
  return `eTest-${uuid}@gmail.com`;
}
module.exports = { credentials, generateRandomEmail };
