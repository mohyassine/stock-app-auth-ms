const { validate } = require('express-validation');

const {
  addCredentialsSchema,
  sendEmailSchema,
  getAllUsersSchema,
  getUsersEmailSchema,
  activateDeactivateSchema,
  updatePersonaSchema,
} = require('../validation/schema/users');
const {
  getUserInfo,
  addCredentialsAndInvite,
  getUsers,
  sendEmail,
  getUsersEmails,
} = require('../controllers/users');
const { updatePersona, activateDeactivateUser } = require('../controllers/users/update');

function usersRoute(router) {
  router.get('/', getUserInfo);

  router.post('/addInvite', validate(addCredentialsSchema), addCredentialsAndInvite);

  router.post('/sendEmail', validate(sendEmailSchema), sendEmail);

  router.post('/allUsers', validate(getAllUsersSchema), getUsers);

  router.get('/usersEmails', validate(getUsersEmailSchema), getUsersEmails);

  router.put('/updatePersona/:personaId', validate(updatePersonaSchema), updatePersona);

  router.put(
    '/activateDeactivate/:personaId',
    validate(activateDeactivateSchema),
    activateDeactivateUser,
  );

  return router;
}

module.exports = {
  usersRoute,
};
