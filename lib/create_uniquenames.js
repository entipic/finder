'use strict';

const _ = require('lodash');
const Model = require('./data').Model;

module.exports = function(unknownName, entity) {
	const uniquenames = [];
	const lang = unknownName.lang;
	const country = unknownName.country;
	let foundName = false;

	if (entity) {
		uniquenames.push({
			name: entity.name,
			lang: lang,
			id: Model.uniqueNameId(entity.name, lang),
			uniqueName: Model.uniqueName(entity.name)
		});

		entity.names.forEach(name => {
			uniquenames.push({
				name: name,
				lang: lang,
				id: Model.uniqueNameId(name, lang),
				uniqueName: Model.uniqueName(name)
			});
		});

		if (entity.englishName) {
			uniquenames.push({
				name: entity.englishName,
				lang: 'en',
				id: Model.uniqueNameId(entity.englishName, 'en'),
				uniqueName: Model.uniqueName(entity.englishName)
			});
		}

		if (country && entity.wikiPage && entity.wikiPage.simpleTitle && entity.wikiPage.specialTitle) {
			uniquenames.push({
				name: entity.wikiPage.simpleTitle,
				lang: lang,
				country: country,
				id: Model.uniqueNameId(entity.wikiPage.simpleTitle, lang, country),
				uniqueName: Model.uniqueName(entity.wikiPage.simpleTitle)
			});
		}

		const uName = Model.uniqueName(unknownName.name);

		for (let i = uniquenames.length - 1; i >= 0; i--) {
			if (uniquenames[i].uniqueName === uName) {
				foundName = true;
				break;
			}
		}
	}

	if (!foundName || country) {
		uniquenames.push({
			name: unknownName.name[0].toUpperCase() + unknownName.name.substr(1),
			lang: lang,
			country: country,
			id: Model.uniqueNameId(unknownName.name, lang, country),
			uniqueName: Model.uniqueName(unknownName.name)
		});
	}

	return _.uniqBy(uniquenames, 'id');
};
