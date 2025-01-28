const util = require('util');
const isEmpty = require('lodash/isEmpty');

const { signUpUserByInvite } = require('../../account/invitation');

const { findUserBy } = require('./identity');

const { sendUserInvite } = require('../../account/auth');

const { CONFLICT } = require('../../../utils/server-codes');
const {
		USER_EXISTS,
} = require('../../../utils/server-messages');
const logger = require('../../../utils/logger').Logger;

const { generateUsername, generatePassword } = require('../../../utils/credentials');

async function sendUserInvitation ({ tenantId, userData }) {
		const newEmail = userData.email;
		
		const checkIfEmailValid = async (email) => {
				const existingEmail = await findUserBy('email', email.toLowerCase(), tenantId);
				return isEmpty(existingEmail);
		};
		
		const generateUserAccountInfo = async (userToInvitePersona, email) => {
				let username;
				let isValidUsername = false;
				let counter = 0;
				
				while (!isValidUsername) {
						username = generateUsername(
								userToInvitePersona.firstName.toLowerCase(),
								userToInvitePersona.lastName.toLowerCase(),
								counter,
						);
						
						// eslint-disable-next-line no-await-in-loop
						const existingUsername = await findUserBy('username', username, tenantId);
						
						isValidUsername = isEmpty(existingUsername);
						counter += 1;
				}
				
				const password = generatePassword();
				
				return {
						firstName: userToInvitePersona.firstName,
						lastName: userToInvitePersona.lastName,
						username,
						password,
						email,
				};
		};
		
		if (!(await checkIfEmailValid(newEmail))) {
				logger.error(util.format('user with email [%s] is already added to the system', newEmail));
				
				return { success: false, user: newEmail, message: USER_EXISTS, code: CONFLICT };
		}
		
		const userAccountInfo = await generateUserAccountInfo(userData, newEmail);
		
		await signUpUserByInvite(userAccountInfo, tenantId);
		
		const userSSOData = await findUserBy('email', newEmail.toLowerCase(), tenantId);
		if (userSSOData && userSSOData.id) {
				await sendUserInvite(userSSOData.id, true, tenantId);
		} else {
				logger.error('Missing user SSO Data');
		}
		
		return userSSOData;
}

module.exports = {
		sendUserInvitation,
};
