const {
  findPersonaProfileByType,
  findProfileById,
  findProfilesByPersonaId,
  findProfileByTypeCode,
} = require('./find');
const { linkProfileToPersona } = require('./link');
const { createPersonaAndProfileInitial, createProfile } = require('./create');

const { updateProfileById } = require('./update');

module.exports = {
  createPersonaAndProfileInitial,
  createProfile,
  findPersonaProfileByType,
  findProfileById,
  findProfilesByPersonaId,
  findProfileByTypeCode,
  linkProfileToPersona,
  updateProfileById,
};
