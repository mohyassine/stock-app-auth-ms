const Persona = require('../../db/models/persona');

const updatePersonaUserIdByUsername = async ({ username, userId }) =>
  Persona.findOneAndUpdate(
    { username: { $regex: new RegExp(`^${username}$`, 'i') } },
    { id: userId },
    { new: true },
  ).lean();

module.exports = {
  updatePersonaUserIdByUsername,
};
