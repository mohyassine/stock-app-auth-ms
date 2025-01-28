const { assert } = require('chai');

const readyCtl = require('../../lib/routes/ready');

describe('Unit Testing Ready object ...', () => {
  it('Should check the status of ready', (done) => {
    assert.isFunction(readyCtl.getStatus);
    const status = readyCtl.getStatus();
    assert.equal(status.response, 'OK');
    done();
  });
});
