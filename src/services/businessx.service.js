const { createBaseService } = require('./base.service');
const prisma = require('../config/db.prisma');

const baseService = createBaseService('business', {
  childFks: [
    { model: 'data_schema', field: 'business_id' }
  ],
});

module.exports = {
  ...baseService,
  create: async (data) => {
    // 1. Check for duplicate name (active records only)
    const existing = await prisma.business.findFirst({
      where: { name: data.name, activate: true }
    });
    if (existing) {
      const err = new Error('Business name already exists');
      err.status = 409;
      throw err;
    }
    return baseService.create(data);
  }
};
