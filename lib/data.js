'use strict';

const Data = require('entipic.data');
const Images = require('entipic.images');
const connection = Data.connect(process.env.ENTIPIC_CONNECTION);
const db = Data.db(connection);

exports.access = new Data.AccessService(db);
exports.control = new Data.ControlService(db);
exports.Model = Data.model;
exports.images = Images.create();
exports.close = connection.close;
