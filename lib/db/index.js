const dotenv = require('dotenv');
const mongoose = require('mongoose');

const logger = require('../../lib/utils/logger').Logger;
const { getMongoUrl } = require('./db_config');

dotenv.config({ silent: true });

let connected = false;

async function connect() {
  if (!connected) {
    try {
      const mongoUrl = getMongoUrl();
      await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      logger.info('Database connected successfully!');
      connected = true;
    } catch (err) {
      logger.error(err.message);
    }
  }
}

function isConnected() {
  return connected;
}

module.exports = { connect, isConnected };
