'use strict';

const Promise = require('bluebird');
const debug = require('debug')('finder');
const findWebEntity = require('./find_web_entity');
const createUniquenames = require('./create_uniquenames');
const Data = require('./data');
const findDbEntity = require('./find_db_entity');
const addUniquenamesToEntity = require('./add_uniquenames_to_entity');
const createNewEntity = require('./create_new_entity');

module.exports = function(unknownName) {

	debug('finding unknownName', unknownName.name, unknownName.lang);

	return findWebEntity(unknownName.name, unknownName.lang, unknownName.country)
		.then((webEntity) => {
			if (!webEntity) {
				return Promise.reject(new Error('Not found web entity for: ' + unknownName.name));
			}

			const uniqueNames = createUniquenames(unknownName, webEntity);
			return findDbEntity(webEntity, uniqueNames)
				.then((entity) => {
					if (!entity) {
						return createNewEntity(webEntity, uniqueNames)
							.then((newEntity) => {
								return addUniquenamesToEntity(newEntity, uniqueNames);
							});
					}
					return addUniquenamesToEntity(entity, uniqueNames);
				});

		});
};
