const { createBaseService } = require('./base.service');

module.exports = createBaseService('data', { fkField: 'data_schema_id' });
