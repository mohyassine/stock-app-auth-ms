const util = require('util');

const Persona = require('../../db/models/persona');
const { makeError } = require('../../errors/utils');
const { CONFLICT } = require('../../utils/server-codes');

async function findPersonaByUsername(username) {
  return Persona.findOne({
    username: {
      $regex: new RegExp(`^${username}$`, 'i'),
    },
  })
    .lean()
    .exec();
}

async function findPersonaByPersonaId(personaId) {
  return Persona.findOne({
    personaId,
  })
    .lean()
    .exec();
}

async function findPersonaByPrimaryEmail(email) {
  const users = await Persona.find({ 'emails.isAccount': true, 'emails.email': email })
    .lean()
    .exec();

  if (users.length > 1) {
    throw makeError(
      util.format('More than 1 accounts found with [%s] as primary email', email),
      CONFLICT,
    );
  }

  return users[0] || {};
}

function findPersonaByProfileId(profileId) {
  const condition = {
    profileIds: profileId,
  };

  return Persona.findOne(condition).lean().exec();
}

module.exports = {
  findPersonaByPrimaryEmail,
  findPersonaByProfileId,
  findPersonaByUsername,
  findPersonaByPersonaId,
};
