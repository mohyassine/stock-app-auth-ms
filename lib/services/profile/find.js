const { isNil } = require('lodash');
const Persona = require('../../db/models/persona');
const Profile = require('../../db/models/profile');

const { COLLECTIONS, PROPERTIES } = require('../../db/utils');

const personaProfilesPipelineStage = [
  {
    $lookup: {
      from: COLLECTIONS.PROFILE,
      localField: PROPERTIES[COLLECTIONS.PERSONA].PROFILE_IDS,
      foreignField: PROPERTIES[COLLECTIONS.PROFILE].ID,
      as: 'personaProfiles',
    },
  },
  { $project: { personaProfiles: 1, _id: 0 } },
  { $unwind: '$personaProfiles' },
  {
    $replaceRoot: {
      newRoot: '$personaProfiles',
    },
  },
];

async function findProfilesByPersonaId(personaId) {
  const pipeline = [];

  const condition = {
    $match: {
      id: personaId,
    },
  };

  pipeline.push(condition, ...personaProfilesPipelineStage);

  return Persona.aggregate(pipeline);
}

async function findPersonaProfileByType(personaId, profileTypeCode) {
  const personaProfiles = await findProfilesByPersonaId(personaId);

  const profileByType = personaProfiles.find(
    (profile) => profile.profileType?.code === profileTypeCode,
  );

  return profileByType;
}

const findProfileById = async (profileId) => Profile.findOne({ id: profileId }).lean().exec();

async function findProfilesByIds({ profileIds, profileTypeCode = null }) {
  const query = {
    id: { $in: profileIds },
  };

  if (profileTypeCode) {
    query['profileType.code'] = profileTypeCode;
  }

  return Profile.find(query).lean().exec();
}

async function findProfileByTypeCode(profileId, profileTypeCode, roleId) {
  const condition = { id: profileId, 'profileType.code': profileTypeCode };

  if (!isNil(roleId)) {
    condition['roles.id'] = roleId;
  }

  return Profile.findOne(condition).lean().exec();
}

module.exports = {
  findPersonaProfileByType,
  findProfileById,
  findProfileByTypeCode,
  findProfilesByPersonaId,
  findProfilesByIds,
};
