/* eslint-disable no-param-reassign */
const isNumber = require('lodash/isNumber');
const isEmpty = require('lodash/isEmpty');
const isUndefined = require('lodash/isUndefined');
const sortBy = require('lodash/sortBy');
const isEqual = require('lodash/isEqual');
const omit = require('lodash/omit');

const util = require('util');

const { makeError } = require('../errors/utils');
const logger = require('./logger').Logger;

const { VALIDATION_ERROR: VALIDATION_ERROR_MESSAGE } = require('./server-messages');
const { BAD_REQUEST } = require('./server-codes');

const filterOutDeletedRecords = ({ records = [], deletedSelector = 'isDeleted' }) =>
  records.filter((record) => !record[deletedSelector]);

const validateOldDataWithNewData = ({
  newRecords,
  oldRecords,
  idSelector = 'id',
  deletedSelector = 'isDeleted',
}) => {
  const nonDeletedRecords = filterOutDeletedRecords({ records: oldRecords, deletedSelector });

  return nonDeletedRecords.every((oldRecord) =>
    newRecords.some((newRecord) => newRecord[idSelector] === oldRecord[idSelector]),
  );
};

/*
    This function takes 3 arguments
        newRecords: coming the api payload
        oldRecords: saved already in db
        isAppend: case we have newRecords as purely new data, we want to append them to the array
        shouldReturnNewRecordsOnly: return only the new data, for some case  we are saving the new data only as in push not the whole data
        idSelector: the id key found in record such as id, profileId ...
        deletedSelector: the key which represents the deletion as isDeleted
    
    Case appending true, we should keep the old records.

    Case appending true, and new record has isAccount as true, make all old records as not default

    Case not appending, if the new records does not contain all the IDs of the non deleted old records
        throw error
        bcz now we can only make the record inactive, we can not delete it

    The counter is calculated by the max Id found in the old records
        case oldRecords empty, initialize to 0

    The old deleted records needs to be kept.
*/
const updateArrayWithIds = ({
  newRecords = [],
  oldRecords = [],
  isAppend = false,
  shouldReturnNewRecordsOnly = false,
  idSelector = 'id',
  deletedSelector = 'isDeleted',
}) => {
  let newList = [];

  if (!isAppend) {
    const isAllIds = validateOldDataWithNewData({
      newRecords,
      oldRecords,
      idSelector,
    });

    if (!isAllIds) {
      logger.error('Some of the old records IDs was not found in the new records.');

      throw makeError(VALIDATION_ERROR_MESSAGE, BAD_REQUEST);
    }
  }

  const isThereNewRecordsWithIsAccount = newRecords.some(({ isAccount }) => isAccount);

  if (isAppend && isThereNewRecordsWithIsAccount) {
    oldRecords = oldRecords.map((elt) => ({ ...elt, isAccount: false }));
  }

  const maxId = !isEmpty(oldRecords) ? Math.max(...oldRecords.map((elt) => elt[idSelector])) : 0;

  let counter = (maxId || 0) + 1;

  const oldDeletedRecords = oldRecords.filter((record) => record[deletedSelector]);

  if (!shouldReturnNewRecordsOnly) {
    if (isAppend) {
      newList = oldRecords;
    } else if (!isEmpty(oldDeletedRecords)) {
      newList = oldDeletedRecords;
    }
  }

  newRecords.forEach((record) => {
    const newRecordId = record[idSelector];

    if (!isUndefined(newRecordId) && isNumber(newRecordId)) {
      let foundRecord = oldRecords?.find((elt) => elt[idSelector] === newRecordId);

      if (foundRecord) {
        const propertiesToBeOmitted = [
          'id',
          'isDeleted',
          'createdAt',
          'updatedAt',
          'isVerified',
          'isAccount',
        ];
        const shouldUpdate = !isEqual(
          omit(foundRecord, propertiesToBeOmitted),
          omit(record, propertiesToBeOmitted),
        );

        foundRecord = { ...foundRecord, ...record };

        if (shouldUpdate) {
          foundRecord = { ...foundRecord, updatedAt: Date.now() };
        }

        const isDeleted = record[deletedSelector];

        if (isDeleted) {
          foundRecord = { ...foundRecord, deletedAt: Date.now() };
        }

        newList.push(foundRecord);
      } else {
        logger.info(util.format('Could not find old record with id %d. Ignoring...', newRecordId));
      }
    } else {
      const isDeleted = record[deletedSelector];

      if (isDeleted) {
        logger.info('Can not insert new deleted record. Ignoring...');
      } else {
        record = { ...record, [idSelector]: counter, createdAt: Date.now(), updatedAt: Date.now() };

        newList.push(record);

        counter += 1;
      }
    }
  });

  const sortedList = sortBy(newList, idSelector);

  return sortedList;
};


module.exports = {
  updateArrayWithIds,
};
