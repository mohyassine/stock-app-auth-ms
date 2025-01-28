const { IS_TENANTS } = require('../config/globals');

const PERSONA_TYPES = Object.freeze({
  [IS_TENANTS.NASCOEMIRATES.key.toUpperCase()]: {
    COMPANY: {
      id: 1231,
      description: 'Company',
    },
    INDIVIDUAL: {
      id: 1230,
      description: 'Individual',
    },
  },
  [IS_TENANTS.BANKERS.key]: {},
  [IS_TENANTS.AIAW.key]: {},
});

const PROFILE_TYPES = Object.freeze({
  [IS_TENANTS.BANKERS.key]: {
    BROKER: {},
    SHAREHOLDER: {},
  },
  [IS_TENANTS.AIAW.key]: {
    INSURER: {},
    SHAREHOLDER: {},
  },
});

const PROFILE_SUB_TYPES = Object.freeze({
  [IS_TENANTS.BANKERS.key]: {},
  [IS_TENANTS.AIAW.key]: {},
});

const ROLES = Object.freeze({
  [IS_TENANTS.BANKERS.key]: {},
  [IS_TENANTS.AIAW.key]: {
    BACK_END: {},
  },
});

module.exports = {
  PERSONA_TYPES,
  ROLES,
  PROFILE_TYPES,
  PROFILE_SUB_TYPES,
};
