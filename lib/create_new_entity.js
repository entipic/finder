'use strict';

const logger = require('./logger');
const debug = require('debug')('finder');
const Promise = require('bluebird');
const _ = require('lodash');
const Data = require('./data');
const createDbPictures = require('./create_db_pictures');

module.exports = function(unknownName, webEntity) {
	webEntity.wikiName = webEntity.englishName;
	webEntity.refIP = unknownName.ip;
	webEntity.refHost = unknownName.host;

	return createDbPictures(unknownName, webEntity)
		.then(pictures => {
			if (pictures && pictures.length) {
				const picture = pictures[0];
				webEntity.pictureHost = picture.host;
				webEntity.pictureId = picture.id;
				webEntity.pictures = _.map(pictures, 'id');

				debug('creating new entity', webEntity);
				logger.info('Creating new entity:' + webEntity.name);

				webEntity.name = webEntity.englishName || webEntity.wikiName || webEntity.name;
				if (webEntity.englishName) {
					webEntity.wikiName = webEntity.englishName;
					delete webEntity.wikiId;
				}

				return Data.control.createEntity(webEntity);

			} else {
				return Promise.reject(new Error('No pictures for ' + unknownName.name));
			}
		});
};
