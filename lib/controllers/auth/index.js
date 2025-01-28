const logger = require('../../utils/logger').Logger;
const { makeError } = require('../../errors/utils');
const { validateToken } = require('../../services');
const { UNAUTHORIZED, SUCCESS_NO_CONTENT } = require('../../utils/server-codes');
const { UNAUTHORIZED: UNAUTHORIZED_USER, INVALID_TOKEN } = require('../../utils/server-messages');

async function validateUserToken(req, res) {
		const { token } = req.body;
		try {
				const result = await validateToken(token);
				
				if (!result.data.active) {
						throw makeError(INVALID_TOKEN, UNAUTHORIZED);
				}
				
				res.statusCode = SUCCESS_NO_CONTENT;
				res.send();
		} catch (error) {
				logger.error(error);
				res.statusCode = UNAUTHORIZED;
				res.send(makeError(UNAUTHORIZED_USER, UNAUTHORIZED));
		}
}

module.exports = { validateUserToken };
