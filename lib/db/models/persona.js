const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema, model } = mongoose;

const { COLLECTIONS } = require('../utils');

const {
  dvDataSchema,
  emailSchema,
  phoneNumberSchema,
  dvDataWithCodeSchema,
} = require('../schemas');

const PersonaSchema = new Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      index: true,
    },
    username: {
      type: String,
      index: true,
    },
    firstName: String,
    middleName: String,
    lastName: String,
    dob: Date,
    phoneNumbers: [phoneNumberSchema],
    emails: [emailSchema],
    gender: dvDataWithCodeSchema,
    title: dvDataSchema,
    pob: String,
    profileIds: {
      type: [Number],
      index: true,
    },
    personaType: dvDataSchema,
    status: dvDataWithCodeSchema, // NEW|VALID|REVIEW|ACTIVE|INVITED
    linkedPrimaryPersonaId: {
      type: Number,
      index: true,
    }, // Primary personaId linked to the persona (duplicate)
    createdAt: { type: Date },
    updatedAt: { type: Date },
    __v: { type: Number, select: false },
  },
  { timestamps: true },
);

PersonaSchema.plugin(AutoIncrement, { personaId: 'persona_id_counter', inc_field: 'personaId' });
module.exports = model('Persona', PersonaSchema, COLLECTIONS.PERSONA);
