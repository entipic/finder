'use strict';

const assert = require('assert');
const findEntity = require('../lib/find_web_entity');

describe('find entity', function() {
	it('ro:adrian ursu', function() {
		return findEntity('adrian ursu', 'ro')
			.then((entity) => {
				assert.equal('Adrian Ursu (jurnalist)', entity.name);
			});
	});
	// it('ro:ro:adrian ursu', function() {
	// 	return findEntity('adrian ursu', 'ro', 'ro')
	// 		.then((entity) => {
	// 			assert.equal('Adrian Ursu (jurnalist)', entity.name);
	// 		});
	// });
	it('ro:md:adrian ursu', function() {
		return findEntity('adrian ursu', 'ro', 'md')
			.then((entity) => {
				assert.equal('Adrian Ursu (cântăreț)', entity.name);
			});
	});

	it('ro:md:ministerul muncii', function() {
		return findEntity('ministerul muncii', 'ro', 'md')
			.then((entity) => {
				assert.equal('Republica Moldova', entity.wikiPage.specialTitle);
			});
	});

	it('ro:ministerul muncii', function() {
		return findEntity('ministerul muncii', 'ro')
			.then((entity) => {
				assert.equal('România', entity.wikiPage.specialTitle);
			});
	});

	it('ro:md:Ministerul Muncii și Solidarității Sociale', function() {
		return findEntity('Ministerul Muncii și Solidarității Sociale', 'ro', 'md')
			.then((entity) => {
				assert.equal('România', entity.wikiPage.specialTitle);
			});
	});
});
