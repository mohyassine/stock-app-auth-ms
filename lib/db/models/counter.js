const { model, Schema } = require('mongoose');

const CounterSchema = new Schema({
  _id: String,
  value: Number,
});

module.exports = model('Counter', CounterSchema);
