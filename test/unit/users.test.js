const chai = require('chai');
const { getUsersPersonaAndProfilesByProfileType } = require('../../lib/services/users/get');
const { generateUsername } = require('../../lib/utils/credentials');
const { credentials } = require('../utils/config');

const { expect } = chai;

describe.skip('Users', () => {
		
		describe('Unit Testing for getUsersPersonaAndProfilesByProfileType', () => {
				it('Should return users of given profile type', async () => {
						const users = await getUsersPersonaAndProfilesByProfileType({
								profileTypeCode: credentials.profileTypeCode.broker,
						});
						expect(users).to.be.an('array');
				});
		});
		
		describe('Unit Testing for generateUsername', () => {
				it('Should returns a username from firstName and lastName', async () => {
						const username = generateUsername(credentials.user.firstName, credentials.user.lastName, 0);
						expect(username).to.be.an('string');
				});
		});
		
		
});

