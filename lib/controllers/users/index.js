const { inviteUsers, addCredentialsAndInvite } = require('./invitation');
const { getUserInfo } = require('./profile');
const { getUsers, getUsersEmails } = require('./get');
const { sendEmail } = require('./sendEmail');
const { updatePersona } = require('./update');

module.exports = {
  getUserInfo,
  inviteUsers,
  addCredentialsAndInvite,
  getUsers,
  sendEmail,
  getUsersEmails,
  updatePersona,
};
