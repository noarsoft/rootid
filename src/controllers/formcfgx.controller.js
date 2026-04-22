const { createBaseController } = require('./base.controller');
const service = require('../services/formcfgx.service');

module.exports = createBaseController(service);
