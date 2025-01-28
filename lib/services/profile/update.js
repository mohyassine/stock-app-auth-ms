const Profile = require('../../db/models/profile');

function updateProfileById(profileId, data) {
  return Profile.findOneAndUpdate({ id: profileId }, data, { new: true }).lean().exec();
}

module.exports = {
  updateProfileById,
};
