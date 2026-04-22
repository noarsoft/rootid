const { createBaseController } = require('./base.controller');
const service = require('../services/formx.service');

module.exports = createBaseController(service);
