const { createBaseService } = require('./base.service');

module.exports = createBaseService('data_schema', {
  fkField: 'business_id',
  childFks: [
    { model: 'view', field: 'data_schema_id' },
    { model: 'form', field: 'data_id' },
    { model: 'data', field: 'data_schema_id' },
  ],
});
