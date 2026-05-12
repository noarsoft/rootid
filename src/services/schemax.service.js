const prisma = require('../config/db.prisma');
const { createBaseService } = require('./base.service');

const base = createBaseService('data_schema', {
  fkField: 'business_id',
  childFks: [
    { model: 'view', field: 'data_schema_id' },
    { model: 'form', field: 'data_id' },
    { model: 'data', field: 'data_schema_id' },
  ],
});

function detectKeyRenames(oldJson, newJson) {
  if (!oldJson || !newJson) return {};
  const renames = {};
  const oldByOrder = {};
  const hasOrder = Object.values(oldJson).some(d => d._order) && Object.values(newJson).some(d => d._order);

  if (hasOrder) {
    for (const [key, def] of Object.entries(oldJson)) {
      if (def._order) oldByOrder[def._order] = key;
    }
    for (const [key, def] of Object.entries(newJson)) {
      if (!def._order) continue;
      const oldKey = oldByOrder[def._order];
      if (oldKey && oldKey !== key) renames[oldKey] = key;
    }
  } else {
    const oldKeys = new Set(Object.keys(oldJson));
    const newKeys = new Set(Object.keys(newJson));
    const removed = [...oldKeys].filter(k => !newKeys.has(k));
    const added = [...newKeys].filter(k => !oldKeys.has(k));
    if (removed.length === added.length) {
      for (let i = 0; i < removed.length; i++) {
        if (oldJson[removed[i]].type === newJson[added[i]].type) {
          renames[removed[i]] = added[i];
        }
      }
    }
  }
  return renames;
}

async function migrateDataKeys(schemaId, renames) {
  const renameEntries = Object.entries(renames);
  if (renameEntries.length === 0) return;

  const dataRecords = await prisma.data.findMany({
    where: { data_schema_id: schemaId, activate: true },
  });

  for (const record of dataRecords) {
    const d = record.data;
    if (!d || typeof d !== 'object') continue;
    const migrated = {};
    for (const [k, v] of Object.entries(d)) {
      migrated[renames[k] || k] = v;
    }
    await prisma.data.update({
      where: { rootid: record.rootid },
      data: { data: migrated },
    });
  }
}

const update = async (rootid, data) => {
  const current = await prisma.data_schema.findFirst({ where: { rootid } });
  if (!current) return null;

  const renames = data.json ? detectKeyRenames(current.json, data.json) : {};

  const result = await base.update(rootid, data);

  if (result && Object.keys(renames).length > 0) {
    await migrateDataKeys(result.id, renames);
  }

  return result;
};

module.exports = { ...base, update };
