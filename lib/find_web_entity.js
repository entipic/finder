'use strict';

const logger = require('./logger');
const debug = require('debug')('finder');
const Promise = require('bluebird');
const finder = require('entity-finder');
const countryName = require('./country-name');
const internal = {};
const Data = require('./data');
const nameComparer = require('name-comparer');
// const utils = require('./utils');

function findAbbreviation(name, lang, country) {
	const words = name.split(/\s+/g);
	const upperName = name.toUpperCase();
	// can be a abbreviation
	if (words.length === 1 && name.length < 8 && name !== upperName) {
		debug('find for abbreviation: ' + upperName);
		return internal.find(upperName, lang, country);
	}
	return Promise.resolve();
}

module.exports = function(name, lang, country) {

	return findAbbreviation(name, lang, country)
		.then(aEntity => {
			if (aEntity) {
				return aEntity;
			}

			return internal.find(name, lang, country)
				.then(bEntity => {
					if (bEntity) {
						return bEntity;
					}
					const words = name.split(/\s/g);
					if (words.length === 2) {
						name = words[1] + ' ' + words[0];
						return internal.find(name, lang, country);
					}
					return bEntity;
				});

		});
};

internal.find = function(name, lang, country) {

	debug('finding entity:' + name, lang);

	const options = { filterDisDeep: true, limit: 2 };

	if (country) {
		country = countryName(country.toUpperCase(), lang);
		if (country) {
			options.tags = [country];
			// let words = country.split(/\s+/g);
			// if (words.length > 1) {
			// 	words = words.filter(word => {
			// 		return word.trim().length > 5;
			// 	});
			// 	options.tags = options.tags.concat(words);
			// }

		}

		debug('finding name with tags', options.tags);
	}
	return finder.find(name, lang, options)
		.then((entities) => {
			const entity = internal.toEntity(internal.getFoundedEntities(entities, name), lang);

			if (entity) {
				debug('found entity: ' + entity.name);
			} else {
				debug('NOT found entity for: ' + name);
			}

			return entity;
		})
		.then(entity => {
			if (entity && entity.englishName) {
				return finder.findTitles(entity.englishName, 'en', 1)
					.then(titles => {
						if (titles && titles.length) {
							entity.description = titles[0].description || entity.description;
						}
						return entity;
					})
					.catch(error => {
						logger.error(error);
						return entity;
					});
			}
			return entity;
		});
};

internal.getFoundedEntities = function(entities, name) {
	if (!entities || entities.length === 0) {
		return null;
	}

	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var names = [entity.name];
		// console.log(entity);
		if (entity.wikiPage && entity.wikiPage.simpleTitle) {
			names.push(entity.wikiPage.simpleTitle);
		}
		if (entity.names) {
			names = names.concat(entity.names);
		}
		// console.log('aici 1', name, names);
		for (var j = 0; j < names.length; j++) {
			if (nameComparer.compare(name, names[j], { transforms: ['CI', 'ABBR', 'CI_ATONIC', 'CI_START'] })) {
				// console.log('aici', name, names[j]);
				return entity;
			}
		}
	}

	logger.warn('not match name with entity', { search: name, name: entities[0].name, wikiId: entities[0].wikiId, names: entities[0].names });

	return null;
};

/**
 * Convert web entity to Entipic entity
 */
internal.toEntity = function(webEntity, lang) {
	if (webEntity) {
		webEntity.lang = webEntity.englishName ? 'en' : lang;
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
