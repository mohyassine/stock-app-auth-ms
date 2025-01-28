const { isReady } = require('../controllers/ready/get');

function getStatus() {
  const status = {};
  status.response = 'OK';
  return status;
}

function ready(router) {
  router.get('/', isReady);

  return router;
}

module.exports = {
  ready,
  getStatus,
};
