const { isEmpty, isNull } = require('lodash');

const { COLLECTIONS } = require('../../../db/utils');
const ProfileModel = require('../../../db/models/profile');

async function getUserProfileById(profileId, removeFields, profileTypeCode = null) {
  const pipeline = [];

  if (!isEmpty(removeFields)) {
    pipeline.push({ $unset: removeFields });
  }
  pipeline.push(
    { $match: { id: profileId } },
    {
      $lookup: {
        from: COLLECTIONS.PERSONA,
        let: { userId: '$id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$$userId', { $ifNull: ['$profileIds', []] }],
              },
            },
          },
          {
            $project: {
              firstName: 1,
              middleName: 1,
              lastName: 1,
              companyName: 1,
              personaType: 1,
              _id: 0,
            },
          },
        ],
        as: 'userInfo',
      },
    },
    {
      $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true },
    },
    {
      $addFields: {
        firstName: '$userInfo.firstName',
        middleName: '$userInfo.middleName',
        lastName: '$userInfo.lastName',
        companyName: '$userInfo.companyName',
        personaType: '$userInfo.personaType',
      },
    },
    {
      $unset: ['userInfo'],
    },
  );

  if (!isNull(profileTypeCode)) {
    pipeline.push({ $match: { 'profileType.code': profileTypeCode } });
  }

  const profileInfo = await ProfileModel.aggregate(pipeline);
  return profileInfo[0];
}

module.exports = {
  getUserProfileById,
};
