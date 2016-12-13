'use strict';

const findWebPictures = require('./find_web_pictures');
const Data = require('./data');

module.exports = function(unknownName, webEntity) {

	return findWebPictures(unknownName, webEntity)
		.map(picture => {

			picture.id = Data.Model.pictureId(picture);

			return Data.control.createPicture(picture)
				.catch(error => {
					// picture exists
					if (error.code === 11000) {
						return picture;
					}
				})
				.then(dbPicture => {
					// is new created picture
					if (dbPicture && dbPicture.createdAt) {
						return Data.images.save(picture.id, picture.data).then(() => dbPicture);
					}
					return dbPicture;
				});
		}).filter(item => !!item);
};
