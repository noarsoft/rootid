const prisma = require('../config/db.prisma');
const { now } = require('../utils/datetime');

function createBaseService(modelName, options = {}) {
  const model = prisma[modelName];
  const { fkField } = options;

  const findAll = (query) => {
    const where = { activate: true };
    if (fkField) {
      const fkId = parseInt(query[fkField], 10);
      if (!isNaN(fkId)) where[fkField] = fkId;
    }
    if (query.flag) where.flag = query.flag;

    const take = Math.min(Number(query.limit) || 50, 200);
    const skip = Number(query.offset) || 0;

    return model.findMany({ where, orderBy: { id: 'desc' }, take, skip });
  };

  const findByRootId = (rootid) => {
    return model.findFirst({ where: { rootid, activate: true } });
  };

  const create = (data) => {
    return model.create({
      data: { ...data, modify_datetime: now() },
    });
  };

  const update = (rootid, data) => {
    return model.update({
      where: { rootid },
      data: { ...data, modify_datetime: now() },
    });
  };

  const softDelete = (rootid) => {
    return model.update({
      where: { rootid },
      data: { activate: false, modify_datetime: now() },
    });
  };

  return { findAll, findByRootId, create, update, softDelete };
}

module.exports = { createBaseService };
