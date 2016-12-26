'use strict';

const _ = require('lodash');
const Model = require('./data').Model;

module.exports = function(unknownName, entity) {
	const uniquenames = [];
	const lang = unknownName.lang;
	const country = unknownName.country;

	function add(un) {
		if (un.name[0] === '.') {
			return;
		}
		uniquenames.push(un);
	}

	if (entity) {
		add({
			name: entity.name,
			lang: lang,
			id: Model.uniqueNameId(entity.name, lang),
			uniqueName: Model.uniqueName(entity.name)
		});

		// entity.names.forEach(name => {
		// 	add({
		// 		name: name,
		// 		lang: lang,
		// 		id: Model.uniqueNameId(name, lang),
		// 		uniqueName: Model.uniqueName(name)
		// 	});
		// });

		if (entity.englishName) {
			add({
				name: entity.englishName,
				lang: 'en',
				id: Model.uniqueNameId(entity.englishName, 'en'),
				uniqueName: Model.uniqueName(entity.englishName)
			});
		}

		if (country && entity.wikiPage && entity.wikiPage.simpleTitle && entity.wikiPage.specialTitle) {
			add({
				name: entity.wikiPage.simpleTitle,
				lang: lang,
				country: country,
				id: Model.uniqueNameId(entity.wikiPage.simpleTitle, lang, country),
				uniqueName: Model.uniqueName(entity.wikiPage.simpleTitle)
			});
		}
	}

	if (country) {
		add({
			name: unknownName.name[0].toUpperCase() + unknownName.name.substr(1),
			lang: lang,
			country: country,
			id: Model.uniqueNameId(unknownName.name, lang, country),
			uniqueName: Model.uniqueName(unknownName.name)
		});
	} else {
		add({
			name: unknownName.name[0].toUpperCase() + unknownName.name.substr(1),
			lang: lang,
			id: Model.uniqueNameId(unknownName.name, lang),
			uniqueName: Model.uniqueName(unknownName.name)
		});
	}

	return _.uniqBy(uniquenames, 'id');
};
