const { now } = require('../utils/datetime');

let idCounters = {};
let stores = {};

function reset() {
    idCounters = { data_schema: 0, view: 0, form: 0, data: 0 };
    stores = { data_schema: [], view: [], form: [], data: [] };
}

function createStatefulModel(modelName) {
    return {
        findMany: jest.fn().mockImplementation(({ where, orderBy, take, skip } = {}) => {
            let rows = stores[modelName].filter(r => {
                for (const [k, v] of Object.entries(where || {})) {
                    if (r[k] !== v) return false;
                }
                return true;
            });
            if (orderBy?.id === 'desc') rows = [...rows].reverse();
            if (skip) rows = rows.slice(skip);
            if (take) rows = rows.slice(0, take);
            return Promise.resolve(rows);
        }),

        findFirst: jest.fn().mockImplementation(({ where } = {}) => {
            const found = stores[modelName].find(r => {
                for (const [k, v] of Object.entries(where || {})) {
                    if (r[k] !== v) return false;
                }
                return true;
            });
            return Promise.resolve(found || null);
        }),

        create: jest.fn().mockImplementation(({ data }) => {
            idCounters[modelName]++;
            const record = {
                rootid: `uuid-${modelName}-${idCounters[modelName]}`,
                id: idCounters[modelName],
                prev_id: null,
                activate: true,
                flag: modelName === 'data' ? 'active' : 'draft',
                modify_datetime: now(),
                ...data,
            };
            stores[modelName].push(record);
            return Promise.resolve({ ...record });
        }),

        update: jest.fn().mockImplementation(({ where, data }) => {
            const idx = stores[modelName].findIndex(r => r.rootid === where.rootid);
            if (idx === -1) {
                const err = new Error('Record not found');
                err.code = 'P2025';
                return Promise.reject(err);
            }
            stores[modelName][idx] = { ...stores[modelName][idx], ...data };
            return Promise.resolve({ ...stores[modelName][idx] });
        }),
    };
}

reset();

const prisma = {
    data_schema: createStatefulModel('data_schema'),
    view: createStatefulModel('view'),
    form: createStatefulModel('form'),
    data: createStatefulModel('data'),
};

prisma._reset = reset;
prisma._stores = stores;

module.exports = prisma;
