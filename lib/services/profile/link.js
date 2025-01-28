const Persona = require('../../db/models/persona');

const linkProfileToPersona = async (profileId, personaId) =>
  Persona.findOneAndUpdate(
    { id: personaId },
    { $addToSet: { profileIds: profileId } },
    { new: true },
  ).lean();

function linkProfileToPersonaByPersonaId(profileId, personaId) {
  return Persona.findOneAndUpdate({ personaId }, { $addToSet: { profileIds: profileId } });
}

module.exports = {
  linkProfileToPersona,
  linkProfileToPersonaByPersonaId,
};
