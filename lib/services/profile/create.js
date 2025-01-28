const Profile = require('../../db/models/profile');
const { createByTypePersona } = require('../persona/create');
const { splitPersonaAndProfileDataByCollection } = require('../../utils/profile');
const { COLLECTIONS } = require('../../db/utils');
const { linkProfileToPersona } = require('./link');
const { PERSONA_STATUS, PROFILE_TYPES } = require('../../config/globals');

function createProfile(data, type, subType) {
  const profileData = { ...data, profileType: type, profileSubType: subType };

  return Profile.create(profileData);
}

/**
 *
 * @param {*} data
 * @param {String} profileTypeCode - example: BRK | INS
 * @param {*} personaTypeCode - example: INDIVIDUAL | COMPANY
 * @param {*} tenantId
 */
async function createPersonaAndProfileInitial(
  data,
  profileTypeCode,
  personaTypeCode,
  { tenantId },
) {
  let profileTypeDvObj;
  if (profileTypeCode === 'INS') {
    profileTypeDvObj = PROFILE_TYPES.INSURED;
  }

  const dataByCollection = splitPersonaAndProfileDataByCollection(data);
  const personaData = dataByCollection[COLLECTIONS.PERSONA];
  const profileData = dataByCollection[COLLECTIONS.PROFILE];

  const defaultPersonaStatus = PERSONA_STATUS.INVITED;
  personaData.status = defaultPersonaStatus;

  const persona = await createByTypePersona(personaTypeCode, personaData, tenantId);
  const profile = await createProfile(profileData, profileTypeDvObj);
  await linkProfileToPersona(profile.id, persona.id);

  return persona;
}

module.exports = {
  createPersonaAndProfileInitial,
  createProfile,
};
