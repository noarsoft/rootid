const mockPrisma = require('../__mocks__/prisma');
jest.mock('../config/db.prisma', () => mockPrisma);

const request = require('supertest');
const app = require('../app');

beforeEach(() => {
    Object.values(mockPrisma).forEach(model => {
        Object.values(model).forEach(fn => {
            if (typeof fn.mockReset === 'function') fn.mockReset();
        });
    });
});

// ─── Health ───

describe('GET /api/health', () => {
    test('returns success', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('ok');
    });
});

// ─── 404 ───

describe('Unknown route', () => {
    test('returns 404', async () => {
        const res = await request(app).get('/api/nonexistent');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

// ─── data_schema (schemax) ───

describe('/api/schemax', () => {
    const SCHEMA_RECORD = {
        rootid: 'uuid-schema-1',
        id: 1,
        prev_id: null,
        name: 'Test Schema',
        json: { fname: { type: 'string' }, age: { type: 'number' } },
        flag: 'draft',
        activate: true,
        modify_datetime: '20260422_120000',
    };

    test('GET / returns list', async () => {
        mockPrisma.data_schema.findMany.mockResolvedValue([SCHEMA_RECORD]);
        const res = await request(app).get('/api/schemax');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].name).toBe('Test Schema');
    });

    test('GET /:rootid returns single record', async () => {
        mockPrisma.data_schema.findFirst.mockResolvedValue(SCHEMA_RECORD);
        const res = await request(app).get('/api/schemax/uuid-schema-1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.rootid).toBe('uuid-schema-1');
        expect(res.body.data.json).toEqual({ fname: { type: 'string' }, age: { type: 'number' } });
    });

    test('GET /:rootid returns 404 when not found', async () => {
        mockPrisma.data_schema.findFirst.mockResolvedValue(null);
        const res = await request(app).get('/api/schemax/nonexistent');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    test('POST / creates schema', async () => {
        mockPrisma.data_schema.create.mockResolvedValue(SCHEMA_RECORD);
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: 'Test Schema', json: { fname: { type: 'string' } } });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Test Schema');
    });

    test('POST / validates required fields', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Validation failed');
    });

    test('PUT /:rootid updates schema', async () => {
        const updated = { ...SCHEMA_RECORD, name: 'Updated' };
        mockPrisma.data_schema.update.mockResolvedValue(updated);
        const res = await request(app)
            .put('/api/schemax/uuid-schema-1')
            .send({ name: 'Updated' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Updated');
    });

    test('DELETE /:rootid soft-deletes', async () => {
        mockPrisma.data_schema.update.mockResolvedValue({ ...SCHEMA_RECORD, activate: false });
        const res = await request(app).delete('/api/schemax/uuid-schema-1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST / validates flag enum', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: 'Test', json: {}, flag: 'invalid' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST / accepts prev_id for versioning', async () => {
        mockPrisma.data_schema.create.mockResolvedValue({ ...SCHEMA_RECORD, id: 2, prev_id: 1 });
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: 'V2', json: {}, prev_id: 1 });
        expect(res.status).toBe(201);
        expect(res.body.data.prev_id).toBe(1);
    });
});

// ─── view (viewx) ───

describe('/api/viewx', () => {
    const VIEW_RECORD = {
        rootid: 'uuid-view-1',
        id: 1,
        prev_id: null,
        data_schema_id: 1,
        view_type: 'table',
        name: 'Default View',
        json_table_config: { columns: [{ key: 'fname', header: 'Name' }] },
        flag: 'draft',
        activate: true,
        modify_datetime: '20260422_120000',
    };

    test('GET / returns views', async () => {
        mockPrisma.view.findMany.mockResolvedValue([VIEW_RECORD]);
        const res = await request(app).get('/api/viewx');
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });

    test('GET / filters by data_schema_id', async () => {
        mockPrisma.view.findMany.mockResolvedValue([VIEW_RECORD]);
        const res = await request(app).get('/api/viewx?data_schema_id=1');
        expect(res.status).toBe(200);
        expect(mockPrisma.view.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ data_schema_id: 1 }),
            })
        );
    });

    test('POST / creates view with json_table_config', async () => {
        mockPrisma.view.create.mockResolvedValue(VIEW_RECORD);
        const res = await request(app)
            .post('/api/viewx')
            .send({
                data_schema_id: 1,
                view_type: 'table',
                json_table_config: { columns: [] },
            });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    test('POST / validates data_schema_id required', async () => {
        const res = await request(app)
            .post('/api/viewx')
            .send({ view_type: 'table' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST / validates view_type required', async () => {
        const res = await request(app)
            .post('/api/viewx')
            .send({ data_schema_id: 1 });
        expect(res.status).toBe(400);
    });

    test('PUT /:rootid updates json_table_config', async () => {
        const updated = { ...VIEW_RECORD, json_table_config: { columns: [{ key: 'age', header: 'Age' }] } };
        mockPrisma.view.update.mockResolvedValue(updated);
        const res = await request(app)
            .put('/api/viewx/uuid-view-1')
            .send({ json_table_config: { columns: [{ key: 'age', header: 'Age' }] } });
        expect(res.status).toBe(200);
        expect(res.body.data.json_table_config.columns[0].key).toBe('age');
    });
});

// ─── form (formcfgx) ───

describe('/api/formcfgx', () => {
    const FORM_RECORD = {
        rootid: 'uuid-form-1',
        id: 1,
        prev_id: null,
        data_id: 1,
        name: 'Default Form',
        json_form_config: { colnumbers: 6, controls: [] },
        flag: 'draft',
        activate: true,
        modify_datetime: '20260422_120000',
    };

    test('GET / returns form configs', async () => {
        mockPrisma.form.findMany.mockResolvedValue([FORM_RECORD]);
        const res = await request(app).get('/api/formcfgx');
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });

    test('GET / filters by data_id', async () => {
        mockPrisma.form.findMany.mockResolvedValue([FORM_RECORD]);
        const res = await request(app).get('/api/formcfgx?data_id=1');
        expect(res.status).toBe(200);
        expect(mockPrisma.form.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ data_id: 1 }),
            })
        );
    });

    test('POST / creates form config with json_form_config', async () => {
        mockPrisma.form.create.mockResolvedValue(FORM_RECORD);
        const res = await request(app)
            .post('/api/formcfgx')
            .send({
                data_id: 1,
                json_form_config: { colnumbers: 6, controls: [] },
            });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    test('POST / validates data_id required', async () => {
        const res = await request(app)
            .post('/api/formcfgx')
            .send({ json_form_config: {} });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('PUT /:rootid updates form config', async () => {
        const updated = { ...FORM_RECORD, name: 'Updated Form' };
        mockPrisma.form.update.mockResolvedValue(updated);
        const res = await request(app)
            .put('/api/formcfgx/uuid-form-1')
            .send({ name: 'Updated Form' });
        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Updated Form');
    });

    test('DELETE /:rootid soft-deletes', async () => {
        mockPrisma.form.update.mockResolvedValue({ ...FORM_RECORD, activate: false });
        const res = await request(app).delete('/api/formcfgx/uuid-form-1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

// ─── data (formx) ───

describe('/api/formx', () => {
    const DATA_RECORD = {
        rootid: 'uuid-data-1',
        id: 1,
        prev_id: null,
        data_schema_id: 1,
        data: { fname: 'John', age: 30 },
        flag: 'active',
        activate: true,
        modify_datetime: '20260422_120000',
    };

    test('GET / returns data records', async () => {
        mockPrisma.data.findMany.mockResolvedValue([DATA_RECORD]);
        const res = await request(app).get('/api/formx');
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].data.fname).toBe('John');
    });

    test('GET / filters by data_schema_id', async () => {
        mockPrisma.data.findMany.mockResolvedValue([DATA_RECORD]);
        const res = await request(app).get('/api/formx?data_schema_id=1');
        expect(res.status).toBe(200);
        expect(mockPrisma.data.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ data_schema_id: 1 }),
            })
        );
    });

    test('POST / creates data record', async () => {
        mockPrisma.data.create.mockResolvedValue(DATA_RECORD);
        const res = await request(app)
            .post('/api/formx')
            .send({
                data_schema_id: 1,
                data: { fname: 'John', age: 30 },
            });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.data.fname).toBe('John');
    });

    test('POST / validates data_schema_id required', async () => {
        const res = await request(app)
            .post('/api/formx')
            .send({ data: { fname: 'Test' } });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('PUT /:rootid updates data', async () => {
        const updated = { ...DATA_RECORD, data: { fname: 'Jane', age: 25 } };
        mockPrisma.data.update.mockResolvedValue(updated);
        const res = await request(app)
            .put('/api/formx/uuid-data-1')
            .send({ data: { fname: 'Jane', age: 25 } });
        expect(res.status).toBe(200);
        expect(res.body.data.data.fname).toBe('Jane');
    });

    test('DELETE /:rootid soft-deletes', async () => {
        mockPrisma.data.update.mockResolvedValue({ ...DATA_RECORD, activate: false });
        const res = await request(app).delete('/api/formx/uuid-data-1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST / validates flag enum (active/archived)', async () => {
        const res = await request(app)
            .post('/api/formx')
            .send({ data_schema_id: 1, data: {}, flag: 'draft' });
        expect(res.status).toBe(400);
    });
});

// ─── Response format consistency ───

describe('Response format', () => {
    test('all success responses have { success: true, data }', async () => {
        mockPrisma.data_schema.findMany.mockResolvedValue([]);
        const res = await request(app).get('/api/schemax');
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
    });

    test('all error responses have { success: false, error }', async () => {
        mockPrisma.data_schema.findFirst.mockResolvedValue(null);
        const res = await request(app).get('/api/schemax/nonexistent');
        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('error');
    });
});

// ─── DB column naming (อิงจาก DB design) ───

describe('DB column naming matches design', () => {
    test('data_schema uses rootid, id, prev_id, json, modify_datetime', async () => {
        const record = {
            rootid: 'uuid-1', id: 1, prev_id: null,
            name: 'Test', json: {}, flag: 'draft',
            activate: true, modify_datetime: '20260422_120000',
        };
        mockPrisma.data_schema.findFirst.mockResolvedValue(record);
        const res = await request(app).get('/api/schemax/uuid-1');
        const d = res.body.data;
        expect(d).toHaveProperty('rootid');
        expect(d).toHaveProperty('id');
        expect(d).toHaveProperty('prev_id');
        expect(d).toHaveProperty('json');
        expect(d).toHaveProperty('modify_datetime');
        expect(d).not.toHaveProperty('root_id');
        expect(d).not.toHaveProperty('previous_id');
        expect(d).not.toHaveProperty('modified_date_time');
    });

    test('view uses data_schema_id FK and json_table_config', async () => {
        const record = {
            rootid: 'uuid-v1', id: 1, prev_id: null,
            data_schema_id: 1, view_type: 'table', name: 'View',
            json_table_config: {}, flag: 'draft', activate: true,
            modify_datetime: '20260422_120000',
        };
        mockPrisma.view.findFirst.mockResolvedValue(record);
        const res = await request(app).get('/api/viewx/uuid-v1');
        const d = res.body.data;
        expect(d).toHaveProperty('data_schema_id');
        expect(d).toHaveProperty('json_table_config');
        expect(d).not.toHaveProperty('fk_data_schema');
    });

    test('form uses data_id FK and json_form_config', async () => {
        const record = {
            rootid: 'uuid-f1', id: 1, prev_id: null,
            data_id: 1, name: 'Form',
            json_form_config: {}, flag: 'draft', activate: true,
            modify_datetime: '20260422_120000',
        };
        mockPrisma.form.findFirst.mockResolvedValue(record);
        const res = await request(app).get('/api/formcfgx/uuid-f1');
        const d = res.body.data;
        expect(d).toHaveProperty('data_id');
        expect(d).toHaveProperty('json_form_config');
    });

    test('data uses data_schema_id FK', async () => {
        const record = {
            rootid: 'uuid-d1', id: 1, prev_id: null,
            data_schema_id: 1, data: { name: 'Test' },
            flag: 'active', activate: true,
            modify_datetime: '20260422_120000',
        };
        mockPrisma.data.findFirst.mockResolvedValue(record);
        const res = await request(app).get('/api/formx/uuid-d1');
        const d = res.body.data;
        expect(d).toHaveProperty('data_schema_id');
        expect(d).toHaveProperty('data');
    });
});
