'use strict';

const Data = require('entipic.data');
const Images = require('entipic.images');

const db = Data.db(Data.connect(process.env.ENTIPIC_CONNECTION));

exports.access = new Data.AccessService(db);
exports.control = new Data.ControlService(db);
exports.Model = Data.model;
exports.images = Images.create();
