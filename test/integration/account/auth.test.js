const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../../app');
const { credentials } = require('../../utils/config');

chai.use(chaiHttp);
chai.should();

const { expect } = chai;

let chaiRequester = null;
let authToken = null;
const cache = require('../../utils/cache');

describe('Account', () => {
  before(async () => {
    chaiRequester = chai.request(app).keepOpen();
  });

  describe('POST /account/signin', () => {
    
				it('should return the user logged in', async () => {
      const response = await chaiRequester
        .post('/account/signin')
        .set('Accept', 'application/vnd.nasco.auth')
        .set('X-TENANT-PLATFORM', 'NASCOEMIRATES')
        .send({
          username: credentials.loginUser.username,
          password: credentials.loginUser.password,
        });

      response.should.have.status(200);

      const { body: responseBody } = response;

      expect(responseBody).to.be.an('object');

      authToken = responseBody?.data?.access_token;
      cache.set('authToken', authToken, 3600); // Cache for 1 hour
    });
				
  });

  after(() => {
    chaiRequester.close();
  });
});
