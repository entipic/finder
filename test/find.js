'use strict';

// const assert = require('assert');
const find = require('../lib/find');

describe('find', function() {
	it('ro:adrian ursu', function() {
		return find({ name: 'adrian ursu', lang: 'ro', ip: '1212.232.23', host: '192.168.0.1' });
	});
	it('ro:ro:adrian ursu', function() {
		return find({ name: 'adrian ursu', lang: 'ro', country: 'ro', ip: '1212.232.23', host: '192.168.0.1' });
	});
	it('ro:md:adrian ursu', function() {
		return find({ name: 'adrian ursu', lang: 'ro', country: 'md', ip: '1212.232.23', host: '192.168.0.1' });
	});

	it('ro:md:ministerul muncii', function() {
		return find({ name: 'ministerul muncii', lang: 'ro', country: 'md', ip: '1212.232.23', host: '192.168.0.1' })
			.catch(error => {
				console.trace(error);
			});
	});

	it('ro:ministerul muncii', function() {
		return find({ name: 'ministerul muncii', lang: 'ro', ip: '1212.232.23', host: '192.168.0.1' });
	});

	// it('ro:md:Ministerul Muncii și Solidarității Sociale', function() {
	// 	return find({ name: 'Ministerul Muncii și Solidarității Sociale', lang: 'md', country: 'ro', ip: '1212.232.23', host: '192.168.0.1' });
	// });
});
