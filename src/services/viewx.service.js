const { createBaseService } = require('./base.service');

module.exports = createBaseService('view', { fkField: 'data_schema_id' });
