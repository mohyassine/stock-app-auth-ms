/* eslint-disable func-names */
const { Schema, model } = require('mongoose');

const ChangeHistorySchema = new Schema();

module.exports = {
  ChangeHistoryModel: model('ChangeHistories', ChangeHistorySchema),
};
