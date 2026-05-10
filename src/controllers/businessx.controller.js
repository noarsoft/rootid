const { createBaseController } = require('./base.controller');
const service = require('../services/businessx.service');

module.exports = createBaseController(service);
