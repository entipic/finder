'use strict';

let logger = console;

exports.set = function(l) {
	logger = l;
};

exports.warn = function() {
	return logger.warn.apply(logger, arguments);
};

exports.error = function() {
	return logger.error.apply(logger, arguments);
};

exports.info = function() {
	return logger.info.apply(logger, arguments);
};
