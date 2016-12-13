'use strict';

const Promise = require('bluebird');
const Data = require('./data');

module.exports = function(entityId, uniqueNames) {
	return Data.access.entity({ where: { _id: entityId } })
		.then(entity => {
			if (!entity) {
				return Promise.reject(new Error('Cannot find entity id=' + entityId));
			}

			return Promise.map(uniqueNames, un => {
					un.entityId = entityId;
					un.pictureId = entity.pictureId;
					return Data.control.createUniqueName(un)
						.catch(() => {
							// unique name exists
							// if (error.code === 11000) {

							// }
						});
				});

		});
};
