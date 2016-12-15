'use strict';

const request = require('./request');
const internal = {};
const searchImages = require('./google_images');
const Images = require('entipic.images');

/**
 * Find pictures on the web for a web entity and an unknown name.
 * @param  {Object} unknownName Unknown name
 * @param  {Object} webEntity   A web entity.
 * @return {Array[Object]}			Created pictures.
 */
module.exports = function(unknownName, webEntity) {
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
		.map(function(image) {
			return request({
					url: image.url,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36',
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
						'Accept-Language': 'en-US,en;q=0.8,cs;q=0.6,es;q=0.4,hu;q=0.2,it;q=0.2,lt;q=0.2,ro;q=0.2,ru;q=0.2,sk;q=0.2,uk;q=0.2,pl;q=0.2,bg;q=0.2'
					},
					encoding: null,
					timeout: 1000 * 3
				})
				.then(function(result) {
					return internal.processImage(result.body, image);
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

internal.processImage = function(data, image) {
	return Images.dhash(data)
		.then(function(hash) {
			return {
				dHash: hash,
				url: image.url,
				host: image.host,
				data: data
			};
		});
};
