const { validate } = require('express-validation');

const { verifyMobileNumber } = require('../controllers/account');
const { mobileVerification } = require('../validation/schema/account');

function authenticatedAccountRoute(router) {
  router.post('/verification/mobile', validate(mobileVerification), verifyMobileNumber);

  return router;
}

module.exports = authenticatedAccountRoute;
