'use strict';

/**
 * Search for images on google
 *
 */

const cheerio = require('cheerio');
const request = require('./request');

const INVALID_HOSTS = [
	'feelgrafix.com',
	'picturesstar.com'
];


module.exports = function(name, lang, country, options) {
	options = options || {};
	options.limit = options.limit || 2;
	//options.type = options.type || 'photo';
	let url = 'https://www.google.com/search?q={q}&lr=&cr={country}&prmd=imvnslo&source=lnms&tbm=isch&tbas=0&tbs=itp:{type},isz:lt,islt:qsvga,ift:jpg&safe=on';
	url = url.replace('{q}', encodeURIComponent(name))
		.replace('{type}', options.type || '');
	//.replace('{lang}', lang || 'en');

	if (country) {
		url = url.replace('{country}', 'country' + country.toUpperCase());
	} else {
		url = url.replace('{country}', '');
	}

	// console.log('image url', url);

	const reqOptions = {
		url: url,
		gzip: true,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language': 'en-US,en;q=0.8,cs;q=0.6,es;q=0.4,hu;q=0.2,it;q=0.2,lt;q=0.2,ro;q=0.2,ru;q=0.2,sk;q=0.2,uk;q=0.2,pl;q=0.2,bg;q=0.2'
		}
	};

	return request(reqOptions)
		.then(function(result) {
			const page = cheerio.load(result.body);

			const list = [];

			const elements = page('div.rg_meta', 'body');

			for (let i = 0; i < elements.length; i++) {

				const json = JSON.parse(page(elements[i]).text());
				const iurl = decodeURIComponent(json.ou);
				const link = decodeURIComponent(json.ru);
				const host = decodeURIComponent(json.isu);

				if (iurl) {
					if (INVALID_HOSTS.indexOf(host) < 0) {
						list.push({ link: link, url: iurl, host: host });
					}
				}

				if (list.length >= options.limit) {
					break;
				}
			}

			return list;
		});
};
