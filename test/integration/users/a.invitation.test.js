const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app');
const { credentials, generateRandomEmail } = require('../../utils/config');

chai.use(chaiHttp);
chai.should();

const { expect } = chai;

let chaiRequester = null;
let authToken = null;
let persona = null;

const cache = require('../../utils/cache'); // Use shared cache

describe('Users', () => {
		before(async () => {
				chaiRequester = chai.request(app).keepOpen();
				authToken = cache.get('authToken');
		});
		
		describe('POST /users/addInvite', () => {
				it('should create a user', async () => {
						const randomEmail = generateRandomEmail();
						const response = await chaiRequester
								.post('/users/addInvite')
								.set('Accept', 'application/vnd.nasco.auth')
								.set('Authorization', `Bearer ${authToken}`)
								.send({
										firstName: credentials.user.firstName,
										lastName: credentials.user.lastName,
										email: randomEmail,
										type: credentials.user.type,
								});
						
						response.should.have.status(200);
						
						const { body: responseBody } = response;
						
						expect(responseBody).to.be.an('object');
						
						persona = responseBody.personaId;
						cache.set('personaId', persona, 3600);
				});
		});
		
		after(() => {
				chaiRequester.close();
		});
});
