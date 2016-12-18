'use strict';

const Promise = require('bluebird');
const debug = require('debug')('finder');
const findWebEntity = require('./find_web_entity');
const createUniquenames = require('./create_uniquenames');
const findDbEntity = require('./find_db_entity');
const addUniquenamesToEntity = require('./add_uniquenames_to_entity');
const createNewEntity = require('./create_new_entity');
const logger = require('./logger');

module.exports = function(unknownName) {

	debug('finding unknownName', unknownName.name, unknownName.lang);

	return findWebEntity(unknownName.name, unknownName.lang, unknownName.country)
		.then((webEntity) => {
			if (!webEntity) {
				logger.warn('Not found web entity for: ' + unknownName.name);
				if (unknownName.name.split(/ /g).length < 2) {
					return Promise.reject('Not found web entity for: ' + unknownName.name);
				}
			} else {
				if (typeof webEntity.name !== 'string') {
					return Promise.reject(new Error('Inavlid webEntity!!!'));
				}
			}

			const uniqueNames = createUniquenames(unknownName, webEntity);
			return findDbEntity(webEntity, uniqueNames)
				.then((entityId) => {
					if (!entityId) {
						return createNewEntity(unknownName, webEntity)
							.then((newEntity) => {
								return addUniquenamesToEntity(newEntity.id, uniqueNames);
							});
					}
					return addUniquenamesToEntity(entityId, uniqueNames);
				});

		});
};
