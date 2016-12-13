'use strict';

const find = require('./find');

exports.find = find;

/**
 * AWS Lambda handler
 */
exports.handler = function(event, context, callback) {
	return find(event).then(() => callback(), callback);
};
