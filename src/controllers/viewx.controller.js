const { createBaseController } = require('./base.controller');
const service = require('../services/viewx.service');

module.exports = createBaseController(service);
