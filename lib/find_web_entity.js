'use strict';

const debug = require('debug')('finder');
const findEntity = require('entity-finder').find;
const countryName = require('country-name');
const internal = {};
const Data = require('./data');

module.exports = function(name, lang, country) {

	debug('finding entity:' + name, lang);

	const options = { filterDisDeep: true, limit: 1 };
	if (country) {
		country = countryName(country.toUpperCase(), lang);
		if (country) {
			options.tags = [country];
		}

		debug('finding name with tags', options.tags);
	}
	return findEntity(name, lang, options)
		.then((entities) => {
			const entity = entities.length > 0 ? internal.toEntity(entities[0]) : null;

			if (entity) {
				debug('found entity: ' + entity.name);
			} else {
				debug('NOT found entity for: ' + name);
			}

			return entity;
		});
};

/**
 * Convert web entity to Entipic entity
 */
internal.toEntity = function(webEntity) {
	if (webEntity) {
		webEntity.names = webEntity.names || [];
		webEntity.uniqueName = Data.Model.uniqueName(webEntity.englishName || webEntity.name);
		webEntity.popularity = webEntity.wikiPage && webEntity.wikiPage.langlinks && webEntity.wikiPage.langlinks.length || 0;
	}
	return webEntity;
	// if (!webEntity) {
	// 	return null;
	// }
	// console.log(webEntity);
	// const entity = {
	// 	name: webEntity.englishName || webEntity.name,
	// 	lang: webEntity.lang,
	// 	type: webEntity.type,
	// 	types: webEntity.types,
	// 	props: webEntity.props,
	// 	description: webEntity.description,
	// 	names: webEntity.names || []
	// };

	// return entity;
};
