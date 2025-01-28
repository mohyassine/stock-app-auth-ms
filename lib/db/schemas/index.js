const { Schema } = require('mongoose');

// Schema used for all Master Data elements
const dvDataSchema = new Schema(
  {
    id: Number,
    description: String,
  },
  { _id: false },
);

const dvDataWithCodeSchema = new Schema(
  {
    id: Number,
    code: String,
    description: String,
    longDescription: String,
  },
  { _id: false },
);

// Common schemas between all models
const phoneNumberSchema = new Schema(
  {
    id: { type: Number, index: true },
    nationalNumber: String,
    country: dvDataWithCodeSchema,
    phoneNumberType: dvDataSchema,
    isAccount: { type: Boolean, default: false },
    isDeleted: { type: Boolean, index: true, default: false },
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  },
  { _id: false },
);

const emailSchema = new Schema(
  {
    id: { type: Number, index: true },
    email: String,
    isAccount: { type: Boolean, default: false },
    isDeleted: { type: Boolean, index: true, default: false },
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  },
  { _id: false },
);

// used for documentProperty (metadata from dv)
const dvDataSchemaWithValue = new Schema(
  {
    id: Number,
    description: String,
    value: Schema.Types.Mixed,
    validateAgainst: String,
    inputValue: Schema.Types.Mixed,
  },
  { _id: false },
);

module.exports = {
  dvDataSchema,
  dvDataWithCodeSchema,
  phoneNumberSchema,
  emailSchema,
  dvDataSchemaWithValue,
};
