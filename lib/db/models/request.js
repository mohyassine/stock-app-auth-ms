const mongoose = require('mongoose');
const { REQUEST_TYPES } = require('../../config/globals');

const { Schema, model } = mongoose;

const RequestDataSchema = new Schema(
  {
    quotationId: String,
    type: {
      type: String,
      enum: Object.values(REQUEST_TYPES).map((value) => value),
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true, collection: 'requests' },
);

module.exports = model('Request', RequestDataSchema);
