const { isEmpty, isNil } = require('lodash');
const personaModel = require('../../db/models/persona');
const profileModel = require('../../db/models/profile');

const { fuzzySearchRegExp } = require('../../utils/regex');
const { PERSONA_STATUS } = require('../../config/globals');

const getUsersFromPersonaIds = async ({
  personaIds,
  searchText,
  sortBy,
  sortOrder,
  limit,
  page,
  onlyActive,
}) => {
  const condition = {
    $match: {
      personaId: { $in: personaIds },
    },
  };
  if (onlyActive) {
    condition.$match['status.id'] = { $in: [PERSONA_STATUS.ACTIVE.id, PERSONA_STATUS.VALID.id] };
  }
  const pipeline = [
    condition,
    // {
    // 		$project: {
    // 				personaId: 1,
    // 				firstName: 1,
    // 				lastName: 1,
    // 				username: 1,
    // 				emails: 1,
    // 				createdAt: 1,
    // 				status: 1,
    // 				id: 1,
    // 				'profileIds': 1,
    // 				_id: 0,
    // 		},
    // }
  ];
  if (searchText) {
    pipeline.push({
      $match: {
        $or: [
          { firstName: { $regex: fuzzySearchRegExp(searchText) } },
          { lastName: { $regex: fuzzySearchRegExp(searchText) } },
          { username: { $regex: fuzzySearchRegExp(searchText) } },
        ],
      },
    });
  }

  if (!isEmpty(sortBy)) {
    const sOrder = sortOrder === 'ASC' ? 1 : -1;
    pipeline.push({ $sort: { [sortBy]: sOrder, _id: 1 } });
  }

  if (!isNil(limit) && limit > 0) {
    pipeline.push(
      { $skip: parseInt(page, 10) * parseInt(limit, 10) },
      { $limit: parseInt(limit, 10) },
    );
  }

  try {
    const users = await personaModel.aggregate(pipeline).exec();
    return users;
  } catch (error) {
    throw error;
  }
};

const getUsersFromProfileIds = async ({ profileIds }) => {
  const condition = {
    profileIds: { $in: profileIds },
  };

  try {
    const users = await personaModel.find(condition).lean().exec();
    return users;
  } catch (error) {
    throw error;
  }
};

const getActiveUsersEmailsFromPersonaIds = async (personaIds) => {
  const users = await personaModel.find({
    personaId: { $in: personaIds },
    'status.id': { $in: [PERSONA_STATUS.ACTIVE.id, PERSONA_STATUS.VALID.id] },
  });

  return users;
};

const getUsersPersonaAndProfilesByProfileType = async ({ profileTypeCode }) => {
  try {
    const profiles = await profileModel.find({ 'profileType.code': profileTypeCode });
    const users = [];

    await Promise.all(
      profiles.map(async (profile) => {
        const persona = await personaModel.findOne({
          profileIds: { $in: [profile.id] },
          'status.id': { $in: [PERSONA_STATUS.ACTIVE.id, PERSONA_STATUS.VALID.id] },
        });
        // if personal is not active, should not return profile
        if (persona) {
          users.push({ persona, profile });
        }
      }),
    );
    return users;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUsersFromPersonaIds,
  getUsersFromProfileIds,
  getUsersPersonaAndProfilesByProfileType,
  getActiveUsersEmailsFromPersonaIds,
};
