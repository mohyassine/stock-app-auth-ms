const COLLECTIONS = {
  PERSONA: 'personas',
  PROFILE: 'profiles',
  LEAD: 'leads',
};

const PROPERTIES = {
  [COLLECTIONS.PERSONA]: {
    ID: 'id',
    USERNAME: 'username',
    FIRST_NAME: 'firstName',
    MIDDLE_NAME: 'middleName',
    LAST_NAME: 'lastName',
    MOTHER_FIRST_NAME: 'motherFirstName',
    MOTHER_LAST_NAME: 'motherLastName',
    DOB: 'dob',
    GENDER: 'gender',
    TITLE: 'title',
    OCCUPATION: 'occupation',
    PROFILE_IDS: 'profileIds',
    PERSONA_TYPE: 'personaType',
    EMAILS: 'emails',
    PHONE_NUMBERS: 'phoneNumbers',
    LINKED_PRIMARY_PERSONA_ID: 'linkedPrimaryPersonaId',
  },
  [COLLECTIONS.PROFILE]: {
    ID: 'id',
    IS_DEFAULT: 'isDefault',
    PROFILE_TYPE: 'profileType',
    PROFILE_SUB_TYPE: 'profileSubType',
    PROFILE_CODE: 'profileCode',
    ADDED_BY: 'addedBy',
    STATE: 'state',
    ROLES: 'roles',
  },
};

const splitDataToSetAndUnset = (data) => {
  const fieldsToUnset = {};
  const fieldsToSet = {};

  Object.keys(data).forEach((key) => {
    if (data[key] === null) {
      fieldsToUnset[key] = 1;
    } else {
      fieldsToSet[key] = data[key];
    }
  });

  return { $set: fieldsToSet, $unset: fieldsToUnset };
};

module.exports = {
  COLLECTIONS,
  PROPERTIES,
  splitDataToSetAndUnset,
};
