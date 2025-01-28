const isEmpty = require('lodash/isEmpty');

const Persona = require('../../db/models/persona');
const { splitDataToSetAndUnset } = require('../../db/utils');

// TODO: move to ./find.js
function getPersonaByIsId(userIsId, removeFields) {
  let selection = '';

  if (!isEmpty(removeFields)) {
    removeFields.forEach((field) => {
      selection += `-${field} `;
    });
  }

  return Persona.findOne({ id: userIsId }).select(selection).lean().exec();
}

function updatePersonaById(personaId, data) {
  return Persona.findOneAndUpdate({ id: personaId }, data, { new: true }).lean().exec();
}
function updatePersonaByPersonaId(personaId, data) {
  return Persona.findOneAndUpdate({ personaId }, data, { new: true }).lean().exec();
}

function updatePersonaByProfileId(profileId, data) {
  const splittedData = splitDataToSetAndUnset(data);

  return Persona.findOneAndUpdate({ profileIds: { $in: [profileId] } }, splittedData, { new: true })
    .lean()
    .exec();
}

module.exports = {
  getPersonaByIsId,
  updatePersonaById,
  updatePersonaByPersonaId,
  updatePersonaByProfileId,
};
