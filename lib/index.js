'use strict';

const find = require('./find');
const Data = require('./data');

exports.find = find;
exports.end = function() {
	return Data.close();
};
