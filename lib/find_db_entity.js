'use strict';

const Promise = require('bluebird');
const Data = require('./data');
const _ = require('lodash');

module.exports = function(webEntity, uniqueNames) {
	const namesByLanguage = _.filter(uniqueNames,
		un => {
			return !un.country;
		});
	const namesByCountry = _.filter(uniqueNames,
		un => {
			return !!un.country;
		});

	function getNamesByLanguage() {
		if (namesByLanguage.length === 0) {
			return Promise.resolve([]);
		}
		return Data.access.uniquenames({
			where: {
				_id: {
					$in: _.map(namesByLanguage, 'id')
				}
			},
			select: '_id entityId',
			limit: 100
		});
	}

	function getNamesByCountry() {
		if (namesByCountry.length === 0) {
			return Promise.resolve([]);
		}
		return Data.access.uniquenames({
			where: {
				_id: {
					$in: _.map(namesByCountry, 'id')
				}
			},
			select: '_id entityId',
			limit: 100
		});
	}

	return getNamesByLanguage()
		.then((langNames) => {
			if (langNames && langNames.length) {
				return langNames[0].entityId;
			}
			return getNamesByCountry()
				.then((countryNames) => {
					if (countryNames && countryNames.length) {
						return countryNames[0].entityId;
					}
				});
		});
};
