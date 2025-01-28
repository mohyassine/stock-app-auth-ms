const { isEmpty } = require('lodash');
const { SEND_NOTIFICATIONS_BY } = require('../config/globals');
const { sendEmail } = require('../services/email/api');
const { getFullNumber } = require('./numbers');
const { sendSms } = require('../services/sms/index');
const Persona = require('../db/models/persona');
const Profile = require('../db/models/profile');
const logger = require('./logger').Logger;

async function sendEmailAndSMS({
  taskDescription,
  tenantId,
  title,
  receiverIds = [],
  role,
  companyData,
}) {
  const { EMAIL, SMS } = SEND_NOTIFICATIONS_BY;

  let ids = receiverIds;

  if (!isEmpty(companyData)) {
    const {
      parentProfile: { profileMembers },
    } = companyData;

    ids = profileMembers.map(({ profileId }) => profileId);
  }

  await Promise.all(
    ids.map(async (id) => {
      const brokerPersona =
        (await Persona.findOne({ profileIds: [id] })
          .lean()
          .exec()) || {};

      const brokerProfile = (await Profile.findOne({ id }).lean().exec()) || {};

      const {
        notifications: { sendNotificationsBy = [], sendAllTasks = false } = {},
        roles = [],
        id: memberProfileId,
      } = brokerProfile;

      const companyRep = companyData?.parentProfile?.profileMembers?.find(
        ({ profileId: companyMemberId, isCompanyRep }) =>
          companyMemberId === memberProfileId && isCompanyRep,
      );

      const {
        emails: brokerEmails,
        phoneNumbers: brokerPhoneNumbers,
        firstName,
        lastName,
      } = brokerPersona;

      const shouldSendNotificationsByEmail = sendNotificationsBy?.find(
        ({ id: notificationId }) => notificationId === EMAIL.id,
      );
      const shouldSendNotificationsBySMS = sendNotificationsBy?.find(
        ({ id: notificationId }) => notificationId === SMS.id,
      );

      const activeBrokerEmail =
        brokerEmails?.find(({ isAccount }) => isAccount) || brokerEmails?.[0];
      const activeBrokerPhoneNumber =
        brokerPhoneNumbers?.find(({ isAccount }) => isAccount) || brokerPhoneNumbers?.[0];

      const mobileNumberConcatenated = getFullNumber(activeBrokerPhoneNumber);

      const hasValidRole = roles?.some(({ code }) => code === role.code);

      if (!isEmpty(companyData) && !sendAllTasks && !hasValidRole && isEmpty(companyRep)) {
        logger.info(`Broker has no valid role and sendAllTasks flag is not set.`);

        return;
      }

      if (shouldSendNotificationsByEmail?.value) {
        if (isEmpty(activeBrokerEmail)) {
          logger.info(`No email was found ,so email sending was skipped.`);
        } else {
          logger.info(`Sending Email to   ${activeBrokerEmail.email}`);
          sendEmail('notification', activeBrokerEmail.email, {
            subject: title,
            customContent: taskDescription,
            tenantId,
            firstName,
            lastName,
          });
        }
      }

      if (shouldSendNotificationsBySMS?.value) {
        if (isEmpty(mobileNumberConcatenated)) {
          logger.info(
            'No phoneNumber with isAccount = true was found ,so SMS sending was skipped.',
          );
        } else {
          const smsData = `${title} : ${taskDescription}`;

          logger.info(`sending SMS to ${mobileNumberConcatenated}`);

          await sendSms(tenantId, mobileNumberConcatenated, undefined, undefined, smsData);
        }
      }
    }),
  );
}

module.exports = { sendEmailAndSMS };
