const { createBaseService } = require('./base.service');

module.exports = createBaseService('form', { fkField: 'data_id' });
