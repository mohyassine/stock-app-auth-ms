const { makeError } = require('../../errors/utils');
const {
  getUsersFromPersonaIds,
  getUsersFromProfileIds,
  getUsersPersonaAndProfilesByProfileType,
  getActiveUsersEmailsFromPersonaIds,
} = require('../../services/users/get');

const logger = require('../../utils/logger').Logger;
const { SUCCESS, SERVER_ERROR } = require('../../utils/server-codes');
const { INTERNAL_ERROR } = require('../../utils/server-messages');

const getUsers = async (req, res) => {
  try {
    const { personaIds, profileIds, searchText, sortBy, sortOrder, limit, page } = req.body;

    let users;
    if (profileIds) {
      users = await getUsersFromProfileIds({ profileIds });
    } else if (personaIds) {
      users = await getUsersFromPersonaIds({
        personaIds,
        searchText,
        sortBy,
        sortOrder,
        limit,
        page,
      });
    }
    res.statusCode = SUCCESS;
    res.send(users);
  } catch (error) {
    logger.error(error);

    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
};

const getUsersEmails = async (req, res) => {
  try {
    const { recipientTypeCode, personaIds } = req.query;

    let users = [];
    let emails = [];
    if (recipientTypeCode) {
      users = await getUsersPersonaAndProfilesByProfileType({
        profileTypeCode: recipientTypeCode,
      });

      emails = users.map(({ persona }) => persona?.emails).flat();
    }

    if (personaIds) {
      const ids = personaIds.map((id) => Number(id));
      users = await getActiveUsersEmailsFromPersonaIds(ids);
      emails = users.map((persona) => persona.emails).flat();
    }

    const recipients = emails
      .filter((recipient) => recipient?.isAccount && !recipient?.isDeleted)
      .map(({ email }) => email);

    res.statusCode = SUCCESS;
    res.send(recipients);
  } catch (error) {
    const errorCode = error.status || SERVER_ERROR;
    const errorMessage = error.status ? error.message : INTERNAL_ERROR;

    res.statusCode = errorCode;
    res.send(makeError(errorMessage, errorCode));
  }
};

module.exports = { getUsers, getUsersEmails };
