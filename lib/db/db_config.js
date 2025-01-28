const { Logger: logger } = require('../utils/logger');
const { parseBoolean } = require('../utils/strings');

const {
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DATABASE,
  MONGODB_USER,
  MONGODB_PWD,
  AUTH_DB,
  REPLICA_SET_DB,
  IS_MONGODB_CLOUD,
} = process.env;

const dbConfig = {};
dbConfig.getMongoUrl = () => {
  const auth = MONGODB_USER ? `${MONGODB_USER}:${encodeURIComponent(MONGODB_PWD)}@` : '';
  const authDB = AUTH_DB ? `?authSource=${AUTH_DB}` : '';
  const replicaSet = REPLICA_SET_DB ? `&replicaSet=${REPLICA_SET_DB}` : '';
  const isMongodbCLoud = parseBoolean(IS_MONGODB_CLOUD);
  const clusterUrl = `mongodb://${auth}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}${authDB}${replicaSet}&readPreference=primaryPreferred`;
  const atlasURL = `mongodb+srv://${auth}${MONGODB_HOST}/${MONGODB_DATABASE}`;

  const url = isMongodbCLoud ? atlasURL : clusterUrl;

  logger.info(`MongoDB connection URL: ${url}`);
  return url;
};

module.exports = dbConfig;
