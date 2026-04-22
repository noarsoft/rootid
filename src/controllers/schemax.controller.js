const { createBaseController } = require('./base.controller');
const service = require('../services/schemax.service');

module.exports = createBaseController(service);
