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
		  persona = cache.get('personaId');
  });

  describe('POST /users/allUsers', () => {
    
				it('should return list of users', async () => {
      const response = await chaiRequester
        .post('/users/allUsers')
        .set('Accept', 'application/vnd.nasco.auth')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-TENANT-PLATFORM', 'NASCOEMIRATES')
        .send({ personaIds: [persona] });

      response.should.have.status(200);

      const { body: responseBody } = response;

      expect(responseBody).to.be.an('array');
    });
				
  });
		
		describe('GET /users/usersEmails', () => {
				
				it('should return list of users Emails', async () => {
						const response = await chaiRequester
								.get('/users/usersEmails?recipientTypeCode=INS')
								.set('Accept', 'application/vnd.nasco.auth')
								.set('Authorization', `Bearer ${authToken}`)
								.set('X-TENANT-PLATFORM', 'NASCOEMIRATES')
						
						response.should.have.status(200);
						
						const { body: responseBody } = response;
						expect(responseBody).to.be.an('array');
				});
				
		});
		
  after(() => {
    chaiRequester.close();
  });
});
