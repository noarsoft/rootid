const { createBaseService } = require('./base.service');

module.exports = createBaseService('business', {
  childFks: [
    { model: 'data_schema', field: 'business_id' }
  ],
});
