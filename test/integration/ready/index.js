const axios = require('axios');
const dotenv = require('dotenv');
const { expect } = require('chai');

dotenv.config({ silent: true });

const { BASE_URL } = process.env;

describe('Test ready link', () => {
  it('Should return 204', async () => {
    const res = await axios.get(`${BASE_URL}/ready`);

    expect(res.status).to.be.equal(204);
    expect(res.data).to.be.empty;
  });
});
