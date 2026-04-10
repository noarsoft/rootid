const prisma = require('../config/db.prisma');
const { now } = require('../utils/datetime');

const model = prisma.data_schema;

exports.findAll = (query) => {
  const where = { activate: true };
  if (query.flag) where.flag = query.flag;

  const take = Math.min(Number(query.limit) || 50, 200);
  const skip = Number(query.offset) || 0;

  return model.findMany({ where, orderBy: { id: 'desc' }, take, skip });
};

exports.findByRootId = (root_id) => {
  return model.findFirst({ where: { root_id, activate: true } });
};

exports.findById = (id) => {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) return null;
  return model.findFirst({ where: { id: parsed, activate: true } });
};

exports.create = (data) => {
  return model.create({
    data: { ...data, modified_date_time: now() },
  });
};

exports.update = (root_id, data) => {
  return model.update({
    where: { root_id },
    data: { ...data, modified_date_time: now() },
  });
};

exports.softDelete = (root_id) => {
  return model.update({
    where: { root_id },
    data: { activate: false, modified_date_time: now() },
  });
};
