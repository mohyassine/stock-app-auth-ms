const { ROLES } = require('../db/dvFallback');
const { COLLECTIONS, PROPERTIES } = require('../db/utils');

function splitPersonaAndProfileDataByCollection(data) {
  const personaProperties = Object.values(PROPERTIES[COLLECTIONS.PERSONA]);

  const profileProperties = Object.values(PROPERTIES[COLLECTIONS.PROFILE]);

  return Object.keys(data).reduce(
    (accumulator, key) => {
      if (personaProperties.includes(key)) {
        accumulator[COLLECTIONS.PERSONA] = {
          ...accumulator[COLLECTIONS.PERSONA],
          [key]: data[key],
        };
      } else if (profileProperties.includes(key)) {
        accumulator[COLLECTIONS.PROFILE] = {
          ...accumulator[COLLECTIONS.PROFILE],
          [key]: data[key],
        };
      }

      return accumulator;
    },
    { [COLLECTIONS.PERSONA]: {}, [COLLECTIONS.PROFILE]: {} },
  );
}

function hasValidRole(profileRoles = [], allowedPlatformRoles = [], tenantId) {
  const allowedRoles = allowedPlatformRoles?.map((role) => ROLES[tenantId][role]);

  return profileRoles?.some((role) =>
    allowedRoles.some((allowedRole) => allowedRole.id === role.id),
  );
}

module.exports = {
  splitPersonaAndProfileDataByCollection,
  hasValidRole,
};
