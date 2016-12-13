'use strict';

const Promise = require('bluebird');
const request = require('request');

module.exports = function(options) {
	return new Promise((resolve, reject) => {
		request(options, (error, response, body) => {
			if (error) {
				return reject(error);
			}
			resolve({ response: response, body: body });
		});
	});
};
