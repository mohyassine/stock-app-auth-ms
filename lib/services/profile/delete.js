const Profile = require('../../db/models/profile');

function deleteProfileById(profileId) {
  return Profile.deleteOne({ id: profileId }).lean().exec();
}

function deleteProfileByMemberId(memberProfileId) {
  return Profile.findOneAndDelete({
    profileMembers: {
      $elemMatch: {
        profileId: memberProfileId,
        isCompanyRep: true,
      },
    },
  })
    .lean()
    .exec();
}

module.exports = {
  deleteProfileById,
  deleteProfileByMemberId,
};
