const prisma = require('../config/db.prisma');
const { now } = require('../utils/datetime');

function createBaseService(modelName, options = {}) {
  const model = prisma[modelName];
  const { fkField, childFks } = options;

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

  const update = async (rootid, data) => {
    const current = await model.findFirst({ where: { rootid } });
    if (!current) return null;

    await model.update({
      where: { rootid },
      data: { activate: false, modify_datetime: now() },
    });

    const { rootid: _r, id: _i, ...rest } = current;
    const newRecord = await model.create({
      data: {
        ...rest,
        ...data,
        prev_id: current.id,
        activate: true,
        modify_datetime: now(),
      },
    });

    if (childFks) {
      for (const { model: childModel, field } of childFks) {
        await prisma[childModel].updateMany({
          where: { [field]: current.id, activate: true },
          data: { [field]: newRecord.id },
        });
      }
    }

    return newRecord;
  };

  const softDelete = async (rootid) => {
    const current = await model.findFirst({ where: { rootid } });
    if (!current) return null;

    await model.update({
      where: { rootid },
      data: { activate: false, modify_datetime: now() },
    });

    const { rootid: _r, id: _i, ...rest } = current;
    return model.create({
      data: {
        ...rest,
        prev_id: current.id,
        activate: false,
        flag: 'deleted',
        modify_datetime: now(),
      },
    });
  };

  const findHistory = async (rootid) => {
    const record = await model.findFirst({ where: { rootid } });
    if (!record) return [];

    const chain = [record];
    let currentPrevId = record.prev_id;
    while (currentPrevId != null) {
      const prev = await model.findFirst({ where: { id: currentPrevId } });
      if (!prev) break;
      chain.push(prev);
      currentPrevId = prev.prev_id;
    }
    return chain;
  };

  return { findAll, findByRootId, create, update, softDelete, findHistory };
}

module.exports = { createBaseService };
