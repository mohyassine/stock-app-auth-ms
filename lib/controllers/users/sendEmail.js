const { getUsersPersonaAndProfilesByProfileType } = require('../../services/users/get');
const { EMAIL_TEMPLATES } = require('../../config/globals');
const { sendEmail: sendEmailViaNotificationMs } = require('../../services/email/api');

const sendEmail = async (req, res) => {
  const { recipientTypeCode, emailType } = req.query;
  const data = req.body;

  const users = await getUsersPersonaAndProfilesByProfileType({
    profileTypeCode: recipientTypeCode,
  });

  const emails = users.map(({ persona }) => persona.emails).flat();

  const recipients = emails
    .filter((recipient) => recipient.isAccount && !recipient.isDeleted)
    .map(({ email }) => email);

  sendEmailViaNotificationMs(EMAIL_TEMPLATES[emailType], recipients, data);

  res.send();
};

module.exports = { sendEmail };
