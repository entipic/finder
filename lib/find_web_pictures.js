'use strict';

const Data = require('./data');
const internal = {};
const searchImages = require('./google_images');
const Images = require('entipic.images');
const Url = require('url');

/**
 * Find pictures on the web for a web entity and an unknown name.
 * @param  {Object} webEntity   A web entity.
 * @param  {Object} unknownName Unknown name
 * @return {Array[Object]}			Created pictures.
 */
module.exports = function(webEntity, unknownName) {
	const options = { limit: 2 };
	let name = unknownName.name;
	const lang = unknownName.lang;
	let country = unknownName.country;
	if (webEntity) {
		name = webEntity.name;
		country = '';
		if (webEntity.type === 'person') {
			options.type = 'face';
		} else if (webEntity.type === 'group') {
			name += ' logo';
		}
	}

	return searchImages(name, lang, country, options)
		.map(function(url) {
			return request({
					url: url,
					headers: {
						'User-Agent': utils.USER_AGENT,
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
						'Accept-Language': 'en-US,en;q=0.8,cs;q=0.6,es;q=0.4,hu;q=0.2,it;q=0.2,lt;q=0.2,ro;q=0.2,ru;q=0.2,sk;q=0.2,uk;q=0.2,pl;q=0.2,bg;q=0.2'
					},
					encoding: null,
					timeout: 1000 * 3
				})
				.then(function(result) {
					return internal.processImage(result.body, url);
				}).catch(function() {});
		}, {
			concurrency: 2
		}).then(function(images) {
			images = images.filter(function(image) {
				return !!image || image && image.data.length < 5000;
			});

			return images;
		});
};

internal.processImage = function(data, url) {
	return Images.dhash(data)
		.then(function(hash) {
			return {
				dHash: hash,
				sourceUrl: url,
				sourceDomain: Url.parse(url.toLowerCase()).host.replace(/^www\./, ''),
				data: data
			};
		});
};
