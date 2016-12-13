'use strict';

const Data = require('./data');
const findWebPictures = require('./find_web_pictures');

module.exports = function(unknownName, webEntity, uniqueNames) {
	webEntity.wikiName = webEntity.englishName;
	webEntity.refIP = unknownName.ip;
	webEntity.refHost = unknownName.host;

	return Data.control.createEntity(webEntity)
		.then((entity) => {

		});
};
