'use strict';

const DATA = require('./data.json');

module.exports = function(countryCode, language) {
	if (DATA.countryNames[language][countryCode] !== null) {
		return DATA.countryNames[language][countryCode];
	}

	const key = DATA.country[countryCode];
	return DATA.countryNames[language][key];
};
