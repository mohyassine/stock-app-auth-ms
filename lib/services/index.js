const {
  createByTypePersona,
  findPersonaByPrimaryEmail,
  findPersonaByProfileId,
  findPersonaByUsername,
  getPersonaByIsId,
  updatePersonaById,
  updatePersonaByProfileId,
  updatePersonaByPersonaId,
} = require('./persona');

const {
  createPersonaAndProfileInitial,
  createProfile,
  findPersonaProfileByType,
  findProfileById,
  findProfilesByPersonaId,
  findProfileByTypeCode,
  linkProfileToPersona,
  updateProfileById,
} = require('./profile');

const { sendBrokerApprovalEmail } = require('./email');
const { validateToken } = require('./auth');
const {
  findUserBy,
  findUsersBy,
  getUserProfileById,
  updateUserIsProfile,
  updateUserAttributes,
  sendUserInvitation,
} = require('./users/profile');

const {
  recoverPasswordByEmailOTP,
  resetPassword,
  setPreferredChannel,
} = require('./account/recovery/password');
const { deleteUserById } = require('./users/delete');
const { signIn, signUp } = require('./account/auth');
const { signUpUserByInvite } = require('./account/invitation');
const { verifyEmail } = require('./account/verification');
const { recoverUsername } = require('./account/recovery/username');
const { sendAccountConfirmationEmail } = require('./account/confirmation');
const { generateOtp, verifyOtp } = require('./account/otp');

const { sendSms } = require('./sms');

module.exports = {
  createPersonaAndProfileInitial,
  createByTypePersona,
  createProfile,
  deleteUserById,
  findPersonaByPrimaryEmail,
  findPersonaByProfileId,
  findPersonaByUsername,
  findPersonaProfileByType,
  findProfileById,
  findProfileByTypeCode,
  findProfilesByPersonaId,
  linkProfileToPersona,
  signIn,
  signUp,
  findUserBy,
  updateUserIsProfile,
  findUsersBy,
  getPersonaByIsId,
  getUserProfileById,
  recoverPasswordByEmailOTP,
  recoverUsername,
  sendAccountConfirmationEmail,
  resetPassword,
  setPreferredChannel,
  signUpUserByInvite,
  updatePersonaById,
  updatePersonaByProfileId,
  updatePersonaByPersonaId,
  updateProfileById,
  sendBrokerApprovalEmail,
  verifyEmail,
  validateToken,
  sendSms,
  sendUserInvitation,
  generateOtp,
  verifyOtp,
  updateUserAttributes,
};
