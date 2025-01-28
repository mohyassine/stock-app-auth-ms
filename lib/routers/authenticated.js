const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { validate } = require('express-validation');

const { SUCCESS } = require('../utils/server-codes');
const authValidation = require('../validation/auth');
const { checkVersion } = require('../validation/version');
const { authenticateUser, validateToken } = require('../middlewares/auth');

const AuthenticatedRouter = function () {
  const router = new express.Router({ mergeParams: true });
  router.use(cors());
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json({ limit: '5mb' }));
  router.use(express.static('public'));

  router.all(
    '/*',
    validate(authValidation.bearerCheck),
    validateToken,
    authenticateUser,
    validate(checkVersion),
    (req, res, next) => {
      res.statusCode = SUCCESS;
      next();
    },
  );

  return router;
};

module.exports = AuthenticatedRouter;
