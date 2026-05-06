const { createBaseService } = require('./base.service');

module.exports = createBaseService('data_schema', {
  childFks: [
    { model: 'view', field: 'data_schema_id' },
    { model: 'form', field: 'data_id' },
    { model: 'data', field: 'data_schema_id' },
  ],
});
