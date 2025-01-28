const { validate } = require('express-validation');

const { validateUserToken } = require('../controllers/auth');
const { checkVersion } = require('../validation/version');
const { validateTokenSchema } = require('../validation/schema/auth');

function unauthenticatedAuthRoute(router) {
  router.post(
    '/validate/token',
    validate(checkVersion),
    validate(validateTokenSchema),
    validateUserToken,
  );

  return router;
}

module.exports = { unauthenticatedAuthRoute };
