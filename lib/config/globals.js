const STOCK_ROLES = Object.freeze({
  BROKER: {
    id: 1001,
    description: 'Broker',
  },
  CORPORATE: {
    id: 2001,
    description: 'Corporate',
  },
  ENTITY: { id: 2002, description: 'Entity' },
});

const ACTION_ROLES = Object.freeze({
  addClient: {
    id: 9001,
    allowedRoles: [STOCK_ROLES.BROKER.id],
  },
  addEntity: {
    id: 9002,
    allowedRoles: [STOCK_ROLES.BROKER.id],
  },
  editEntity: {
    id: 9003,
    allowedRoles: [STOCK_ROLES.BROKER.id],
  },
  removeEntity: {
    id: 9004,
    allowedRoles: [STOCK_ROLES.BROKER.id],
  },
  addCredentials: {
    id: 9005,
    allowedRoles: [STOCK_ROLES.BROKER.id],
  },
  editCredentials: {
    id: 9011,
    allowedRoles: [STOCK_ROLES.BROKER.id],
  },
  addLocation: {
    id: 9007,
    allowedRoles: [STOCK_ROLES.ENTITY.id, STOCK_ROLES.BROKER.id],
  },
  reviewLocation: {
    id: 9012,
    allowedRoles: [STOCK_ROLES.BROKER.id],
  },
  removeLocation: {
    id: 9008,
    allowedRoles: [STOCK_ROLES.BROKER.id, STOCK_ROLES.ENTITY.id],
  },
  changeEmployeeStatus: {
    id: 9009,
    allowedRoles: [STOCK_ROLES.BROKER.id, STOCK_ROLES.CORPORATE.id],
  },
});

const EMPLOYEE_TYPES = {
  ENTITY: 'Entity',
  CORPORATE: 'Corporate',
};

const PROFILE_TYPES = Object.freeze({
  INSURED: {
    id: 2,
    description: 'Insured',
    code: 'INS',
  },
});

const PERSONA_STATUS = Object.freeze({
  INVITED: { id: 10, code: 'INV', description: 'INVITED' },
  ACTIVE: { id: 11, code: 'ACT', description: 'ACTIVE' },
  VALID: { id: 13, code: 'VL', description: 'VALID' },
  DEACTIVATED: { id: 14, code: 'DEACT', description: 'DEACTIVATED' },
});

const PERSONA_TYPES = Object.freeze({
  INDIVIDUAL: {
    id: 1230,
    description: 'Individual',
  },
});

const IS_TENANTS = Object.freeze({
  DEFAULT: { key: 'DEFAULT', domain: 'carbon.super', urlPrefix: '' },
  BANKERS: {},
  AIAW: {},
  NASCOEMIRATES: {
    key: 'NascoEmirates',
    domain: 'nascoemirates.com',
    urlPrefix: '/t/nascoemirates.com',
  },
});

const SEND_NOTIFICATIONS_BY = Object.freeze({
  EMAIL: {
    id: 1,
    description: 'Email',
  },
  SMS: {
    id: 2,
    description: 'SMS',
  },
});

const DEFAULTS = {
  IS_MOBILE_NUMBER: '961',
};

const URLS = {};

const SMS_TEMPLATES = Object.freeze({
  SIGNUP: 'signup',
  PASSWORD_RESET: 'passwordReset',
  VERIFY_MOBILE: 'verifyMobile',
});

const EMAIL_TEMPLATES = Object.freeze({
  SIGNUP: 'signup',
  PASSWORD_RESET: 'passwordReset',
  ADDITION_OF_BROKER: 'additionOfBroker',
  COLLECTION_MANAGER_POLICY: 'collectionManagerPolicy',
  ENTITY_NEW_LOCATION: 'entityNewLocation',
  BROKER_INCREASE_IN_BASE_VALUE: 'brokerIncreaseInBaseValue',
});

const PRODUCT_NAME = {
  NASCO_INSURANCE: 'Nasco Insurance',
};

const PROMISE_RESULT_STATUS = {
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
};

const PDF_BASE64_HEADER = '%PDF';

const REQUEST_TYPES = {
  IRIS_CREATE_PROFILE: 'IRIS_CREATE_PROFILE',
  IRIS_UPDATE_PROFILE: 'IRIS_UPDATE_PROFILE',
};

module.exports = {
  ACTION_ROLES,
  EMPLOYEE_TYPES,
  DEFAULTS,
  IS_TENANTS,
  PROMISE_RESULT_STATUS,
  URLS,
  SMS_TEMPLATES,
  EMAIL_TEMPLATES,
  PRODUCT_NAME,
  SEND_NOTIFICATIONS_BY,
  PROFILE_TYPES,
  PERSONA_TYPES,
  PERSONA_STATUS,
  STOCK_ROLES,
  PDF_BASE64_HEADER,
  REQUEST_TYPES,
};
