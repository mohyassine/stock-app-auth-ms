const Persona = require('../../db/models/persona');
const { PERSONA_TYPES } = require('../../db/dvFallback');

/**
 *
 * @param {'COMPANY' | 'INDIVIDUAL'} type
 * @param {*} data
 * @param {string} tenantId
 * @returns
 */
async function createByTypePersona(type, data, tenantId) {
  const personaType = PERSONA_TYPES[tenantId][type.toUpperCase()];
  const personaData = { ...data, personaType };

  const newPersona = await Persona.create(personaData);

  return newPersona.toObject();
}

module.exports = {
  createByTypePersona,
};
