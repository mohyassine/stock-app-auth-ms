const { makeError } = require('../../errors/utils');
const { SUCCESS_NO_CONTENT, SERVER_ERROR } = require('../../utils/server-codes');

async function isReady(req, res) {
  try {
    res.statusCode = SUCCESS_NO_CONTENT;
    res.end();
  } catch (error) {
    res.statusCode = SERVER_ERROR;
    res.send(makeError(error.message, SERVER_ERROR));
  }
}

module.exports = { isReady };
