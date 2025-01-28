const mongoose = require('mongoose');
const { REQUEST_TYPES } = require('../../config/globals');

const { Schema, model } = mongoose;

const ErrorResponseDataSchema = new Schema(
  {
    quotationId: String,
    type: {
      type: String,
      enum: Object.values(REQUEST_TYPES).map((value) => value),
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: Number,
  },
  { timestamps: true, collection: 'error_responses' },
);

module.exports = model('ErrorResponse', ErrorResponseDataSchema);
