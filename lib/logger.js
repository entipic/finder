'use strict';

module.exports = console;

// const logger = module.exports = exports = require('winston');

// exports.loggly = function loggly(options) {
// 	options = options || {};
// 	require('winston-loggly');
// 	var logger = options.logger || winston;

// 	logger.add(winston.transports.Loggly, {
// 		level: options.level || process.env.LOGGLY_LEVEL || 'warn',
// 		subdomain: process.env.LOGGLY_DOMAIN,
// 		inputToken: process.env.LOGGLY_TOKEN,
// 		tags: options.tags,
// 		json: options.json
// 	});
// };

// exports.removeConsole = function removeConsole(logger) {
// 	logger = logger || winston;
// 	return logger.remove(logger.transports.Console);
// };


// if (process.env.NODE_ENV === 'production') {
// 	logger.loggly({
// 		tags: ['top20', 'web'],
// 		json: true
// 	});
// 	logger.removeConsole();
// }
