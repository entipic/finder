'use strict';

const Data = require('entipic.data');
const Images = require('entipic.images');

exports.access = new Data.AccessService();
exports.control = new Data.ControlService();
exports.Model = Data.model;
exports.images = Images.create();
