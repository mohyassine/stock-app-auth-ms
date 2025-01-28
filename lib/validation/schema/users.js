const Joi = require('joi');
const { EMPLOYEE_TYPES } = require('../../config/globals');

const sendNotificationsBySchema = Joi.object()
  .keys({
    id: Joi.number().required(),
    description: Joi.string().required(),
    value: Joi.boolean().required(),
  })
  .required()
  .unknown(false);

const updateUserProfileSchema = {
  body: Joi.object()
    .keys({
      notifications: Joi.object()
        .keys({
          sendAllTasks: Joi.boolean().required(),
          sendNotificationsBy: Joi.array().items(sendNotificationsBySchema).required(),
        })
        .optional(),
    })
    .unknown(false),
};

const userInvitation = {
  body: Joi.object()
    .keys({
      emails: Joi.array().items(Joi.string().email().required()).min(1),
      isAnEmployeeInvitation: Joi.boolean().default(false).optional(),
      isOnboardingBrokerInvitation: Joi.boolean().default(false).optional(),
    })
    .required()
    .unknown(false),
};

const addCredentialsSchema = {
  body: Joi.object()
    .keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      type: Joi.string().valid(EMPLOYEE_TYPES.CORPORATE, EMPLOYEE_TYPES.ENTITY).required(), // enum values for 'type'
    })
    .required()
    .unknown(false),
};

const sendEmailSchema = {
  query: Joi.object()
    .keys({
      recipientTypeCode: Joi.string().optional(),
      personaIds: Joi.object().optional(), // to be investigated why it is not array
      emailType: Joi.string().required(),
    })
    .unknown(false),
  body: Joi.object().keys({
    entityName: Joi.string().required(),
    locations: Joi.array()
      .items({
        description: Joi.string().required(),
        stockValue: Joi.string().required(),
        effectiveDate: Joi.string().required(),
      })
      .required(),
  }),
};

const getUsersEmailSchema = {
  query: Joi.object()
    .keys({
      personaIds: Joi.array(),
      recipientTypeCode: Joi.string(),
    })
    .unknown(false),
};

const getAllUsersSchema = {
  body: Joi.object()
    .keys({
      personaIds: Joi.array(),
      profileIds: Joi.array(),
      limit: Joi.number().optional(),
      page: Joi.any().when('limit', {
        is: Joi.exist(),
        then: Joi.number().min(0).required(),
        otherwise: Joi.forbidden(),
      }),
      searchText: Joi.string().optional(),
      sortBy: Joi.string().default('id').optional(),
      sortOrder: Joi.string().when('sortBy', {
        is: Joi.exist(),
        then: Joi.valid('ASC', 'DESC').default('DESC').optional(),
        otherwise: Joi.forbidden(),
      }),
      filters: Joi.string().optional(),
    })
    .unknown(false),
};

const updatePersonaSchema = {
  params: Joi.object()
    .keys({
      personaId: Joi.number().required(),
    })
    .unknown(false),
  body: Joi.object()
    .keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    })
    .required()
    .unknown(false),
};

const activateDeactivateSchema = {
  params: Joi.object()
    .keys({
      personaId: Joi.number().required(),
    })
    .unknown(false),
  body: Joi.object()
    .keys({
      deactivate: Joi.boolean().required(),
    })
    .required()
    .unknown(false),
};

module.exports = {
  getAllUsersSchema,
  userInvitation,
  updateUserProfileSchema,
  addCredentialsSchema,
  sendEmailSchema,
  getUsersEmailSchema,
  activateDeactivateSchema,
  updatePersonaSchema,
};
