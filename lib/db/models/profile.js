const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema, model } = mongoose;

const { COLLECTIONS } = require('../utils');
const {
  dvDataSchema,
  dvDataWithCodeSchema,
} = require('../schemas');
const { CLIENT_STATE } = require('../enums');

const ProfileSchema = new Schema(
  {
    id: {
      type: Number,
      index: true,
    },
    isDefault: Boolean,
    profileType: dvDataWithCodeSchema,
    profileSubType: dvDataSchema,
    profileCode: String,
    assignedTo: Number, // ref to profile id
    assignedToSecondary: Number, // ref to profile id
    isAssignedToPrimary: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
    },
    addedBy: Number, // ref to profile id
    roles: [dvDataWithCodeSchema],
    status: dvDataWithCodeSchema, // status - active, inactive, suspended
    invitationDate: Date,
    state: {
      type: String,
      enum: Object.values(CLIENT_STATE),
      default: CLIENT_STATE[CLIENT_STATE.ACTIVE],
      index: true,
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    __v: { type: Number, select: false },
  },
  { timestamps: true },
);

ProfileSchema.plugin(AutoIncrement, { id: 'profile_id_counter', inc_field: 'id' });
module.exports = model('Profile', ProfileSchema, COLLECTIONS.PROFILE);
