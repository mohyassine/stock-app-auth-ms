/* eslint-disable no-param-reassign */
const YAML = require('yamljs');
const helmet = require('helmet');
const dotenv = require('dotenv');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const JsonRefs = require('json-refs');

dotenv.config({ silent: true });

const { registerAxiosInterceptors } = require('./lib/axios');

registerAxiosInterceptors();

const db = require('./lib/db');
const { usersRoute } = require('./lib/routes/users');
const indexRoute = require('./lib/routes/index');
const accountRoute = require('./lib/routes/account');
const { unauthenticatedAuthRoute } = require('./lib/routes/auth');
const authenticatedAccountRoute = require('./lib/routes/authenticatedAccount');
const defaultRouter = require('./lib/routers/default');
const ErrStrategies = require('./lib/errors/strategies');
const { Logger: logger } = require('./lib/utils/logger');
const errorHandler = require('./lib/errors/errorHandler');
const { ready: readyRoute } = require('./lib/routes/ready');
const authenticatedRouter = require('./lib/routers/authenticated');

db.connect();

const app = express();
const appErrorHandler = errorHandler([ErrStrategies.defaultStrategy]);

const { ENV = 'dev', PORT = 5050 } = process.env;

// TODO: this should be removed on the DEV environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const isProdEnvironment = ENV.includes('prod');

app.use(helmet({ frameguard: { action: 'deny' }, contentSecurityPolicy: isProdEnvironment }));

app.use((req, res, next) => {
		req.getVersion = function validateVer() {
				return req.headers.accept.split('version=')[1];
		};
		next();
});

// Small log message so we know that a request was executed
app.use((req, res, next) => {
		if (req.url !== '/auth/validate/token') {
				if (ENV === 'dev') {
						logger.info('-------------------------');
				}
				
				logger.info(`[${req.method}] ${req.originalUrl}`);
		}
		
		next();
});

app.use('/', indexRoute(defaultRouter()));
app.use('/account', accountRoute(defaultRouter()));
app.use('/account', authenticatedAccountRoute(authenticatedRouter()));
app.use('/auth', unauthenticatedAuthRoute(defaultRouter()));
app.use('/ready', readyRoute(defaultRouter()));
app.use('/users', usersRoute(authenticatedRouter()));

if (!isProdEnvironment) {
		const swaggerDocument = YAML.load('./specs/swagger.yml');
		
		Object.entries(swaggerDocument.paths).forEach((entry) => {
				const [path, pathReference] = entry;
				const isReference = JsonRefs.isRef(pathReference);
				
				if (isReference) {
						const uri = `./specs/${JsonRefs.getRefDetails(pathReference).uri}`;
						const ymlToInject = YAML.load(uri);
						swaggerDocument.paths[path] = ymlToInject.paths[path];
				}
		});
		
		const options = {
				swaggerOptions: {
						persistAuthorization: true,
						tryItOutEnabled: true,
						defaultModelsExpandDepth: -1,
						docExpansion: 'none',
						displayOperationId: true,
						displayRequestDuration: true,
				},
		};
		
		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
}

appErrorHandler(app);

app.listen(PORT, () => {
		logger.info(`Nasco backend listening on port: ${PORT}`);
		logger.info(`running in environment: ${ENV}`);
});

module.exports = app;
