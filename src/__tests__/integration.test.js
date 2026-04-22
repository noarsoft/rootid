const mockPrisma = require('../__mocks__/prismaStateful');
jest.mock('../config/db.prisma', () => mockPrisma);

const request = require('supertest');
const app = require('../app');

beforeEach(() => {
    mockPrisma._reset();
});

// ─── Full Form Builder Workflow ───

describe('Integration: Full Form Builder Workflow', () => {
    test('create schema → view → form config → submit data → query all', async () => {
        // 1. Create schema
        const schemaRes = await request(app)
            .post('/api/schemax')
            .send({ name: 'ฟอร์มลงทะเบียน', json: { fname: { type: 'string' }, age: { type: 'number' } } });
        expect(schemaRes.status).toBe(201);
        const schema = schemaRes.body.data;
        expect(schema.rootid).toBeDefined();
        expect(schema.id).toBe(1);

        // 2. Create view referencing schema
        const viewRes = await request(app)
            .post('/api/viewx')
            .send({
                data_schema_id: schema.id,
                view_type: 'table',
                name: 'Default View',
                json_table_config: {
                    columns: [
                        { key: 'fname', header: 'ชื่อ', width: 'auto', sortable: true },
                        { key: 'age', header: 'อายุ', width: '80', sortable: true },
                    ],
                },
            });
        expect(viewRes.status).toBe(201);
        const view = viewRes.body.data;
        expect(view.data_schema_id).toBe(schema.id);

        // 3. Create form config referencing schema
        const formcfgRes = await request(app)
            .post('/api/formcfgx')
            .send({
                data_id: schema.id,
                name: 'Default Form',
                json_form_config: {
                    colnumbers: 6,
                    controls: [
                        { key: 'fname', label: 'ชื่อ-นามสกุล', colno: 1, rowno: 1, colspan: 6, placeholder: 'กรอกชื่อ' },
                        { key: 'age', label: 'อายุ', colno: 1, rowno: 2, colspan: 3 },
                    ],
                },
            });
        expect(formcfgRes.status).toBe(201);
        const formcfg = formcfgRes.body.data;
        expect(formcfg.data_id).toBe(schema.id);

        // 4. Submit form data (2 records)
        const data1Res = await request(app)
            .post('/api/formx')
            .send({ data_schema_id: schema.id, data: { fname: 'สมชาย', age: 28 } });
        expect(data1Res.status).toBe(201);

        const data2Res = await request(app)
            .post('/api/formx')
            .send({ data_schema_id: schema.id, data: { fname: 'สมหญิง', age: 25 } });
        expect(data2Res.status).toBe(201);

        // 5. Query everything back
        const schemasRes = await request(app).get('/api/schemax');
        expect(schemasRes.body.data).toHaveLength(1);

        const viewsRes = await request(app).get(`/api/viewx?data_schema_id=${schema.id}`);
        expect(viewsRes.body.data).toHaveLength(1);
        expect(viewsRes.body.data[0].json_table_config.columns).toHaveLength(2);

        const cfgsRes = await request(app).get(`/api/formcfgx?data_id=${schema.id}`);
        expect(cfgsRes.body.data).toHaveLength(1);
        expect(cfgsRes.body.data[0].json_form_config.colnumbers).toBe(6);

        const dataRes = await request(app).get(`/api/formx?data_schema_id=${schema.id}`);
        expect(dataRes.body.data).toHaveLength(2);
    });

    test('multiple schemas with independent data', async () => {
        // Schema A
        const schemaA = (await request(app)
            .post('/api/schemax')
            .send({ name: 'Schema A', json: { x: { type: 'string' } } })).body.data;

        // Schema B
        const schemaB = (await request(app)
            .post('/api/schemax')
            .send({ name: 'Schema B', json: { y: { type: 'number' } } })).body.data;

        // Data for A
        await request(app).post('/api/formx').send({ data_schema_id: schemaA.id, data: { x: 'hello' } });
        await request(app).post('/api/formx').send({ data_schema_id: schemaA.id, data: { x: 'world' } });

        // Data for B
        await request(app).post('/api/formx').send({ data_schema_id: schemaB.id, data: { y: 42 } });

        // Query A — should have 2
        const dataA = await request(app).get(`/api/formx?data_schema_id=${schemaA.id}`);
        expect(dataA.body.data).toHaveLength(2);

        // Query B — should have 1
        const dataB = await request(app).get(`/api/formx?data_schema_id=${schemaB.id}`);
        expect(dataB.body.data).toHaveLength(1);
        expect(dataB.body.data[0].data.y).toBe(42);

        // Query all schemas — should have 2
        const allSchemas = await request(app).get('/api/schemax');
        expect(allSchemas.body.data).toHaveLength(2);
    });
});

// ─── Versioning (prev_id) ───

describe('Integration: Versioning', () => {
    test('schema versioning chain: v1 → v2 → v3', async () => {
        const v1 = (await request(app)
            .post('/api/schemax')
            .send({ name: 'V1', json: { fname: { type: 'string' } } })).body.data;
        expect(v1.prev_id).toBeNull();

        const v2 = (await request(app)
            .post('/api/schemax')
            .send({ name: 'V2', json: { fname: { type: 'string' }, age: { type: 'number' } }, prev_id: v1.id })).body.data;
        expect(v2.prev_id).toBe(v1.id);

        const v3 = (await request(app)
            .post('/api/schemax')
            .send({ name: 'V3', json: { fname: { type: 'string' }, age: { type: 'number' }, email: { type: 'string' } }, prev_id: v2.id })).body.data;
        expect(v3.prev_id).toBe(v2.id);

        // Verify chain: v3.prev_id → v2.id → v2.prev_id → v1.id
        expect(v3.id).toBe(3);
        expect(v2.id).toBe(2);
        expect(v1.id).toBe(1);
    });

    test('view versioning with prev_id', async () => {
        const schema = (await request(app)
            .post('/api/schemax')
            .send({ name: 'S', json: {} })).body.data;

        const view1 = (await request(app)
            .post('/api/viewx')
            .send({ data_schema_id: schema.id, view_type: 'table', json_table_config: { columns: [{ key: 'a' }] } })).body.data;

        const view2 = (await request(app)
            .post('/api/viewx')
            .send({ data_schema_id: schema.id, view_type: 'table', json_table_config: { columns: [{ key: 'a' }, { key: 'b' }] }, prev_id: view1.id })).body.data;

        expect(view2.prev_id).toBe(view1.id);
    });
});

// ─── Soft Delete ───

describe('Integration: Soft Delete', () => {
    test('deleted schema disappears from GET list', async () => {
        const s1 = (await request(app).post('/api/schemax').send({ name: 'Keep' })).body.data;
        const s2 = (await request(app).post('/api/schemax').send({ name: 'Delete Me' })).body.data;

        // Before delete — 2 schemas
        let list = await request(app).get('/api/schemax');
        expect(list.body.data).toHaveLength(2);

        // Delete s2
        const delRes = await request(app).delete(`/api/schemax/${s2.rootid}`);
        expect(delRes.status).toBe(200);

        // After delete — 1 schema
        list = await request(app).get('/api/schemax');
        expect(list.body.data).toHaveLength(1);
        expect(list.body.data[0].name).toBe('Keep');
    });

    test('deleted record not found by GET /:rootid', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Gone' })).body.data;

        await request(app).delete(`/api/schemax/${s.rootid}`);

        const res = await request(app).get(`/api/schemax/${s.rootid}`);
        expect(res.status).toBe(404);
    });

    test('delete form data independently', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;

        const d1 = (await request(app).post('/api/formx').send({ data_schema_id: schema.id, data: { a: 1 } })).body.data;
        const d2 = (await request(app).post('/api/formx').send({ data_schema_id: schema.id, data: { a: 2 } })).body.data;
        const d3 = (await request(app).post('/api/formx').send({ data_schema_id: schema.id, data: { a: 3 } })).body.data;

        // Delete middle record
        await request(app).delete(`/api/formx/${d2.rootid}`);

        const list = await request(app).get(`/api/formx?data_schema_id=${schema.id}`);
        expect(list.body.data).toHaveLength(2);
        expect(list.body.data.map(d => d.data.a).sort()).toEqual([1, 3]);
    });
});

// ─── Update Flow ───

describe('Integration: Update', () => {
    test('update schema name then verify', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Original' })).body.data;

        await request(app).put(`/api/schemax/${s.rootid}`).send({ name: 'Updated' });

        const found = await request(app).get(`/api/schemax/${s.rootid}`);
        expect(found.body.data.name).toBe('Updated');
        expect(found.body.data.rootid).toBe(s.rootid);
    });

    test('update schema json fields then verify', async () => {
        const s = (await request(app).post('/api/schemax')
            .send({ name: 'S', json: { a: { type: 'string' } } })).body.data;

        const newJson = { a: { type: 'string' }, b: { type: 'number' } };
        await request(app).put(`/api/schemax/${s.rootid}`).send({ json: newJson });

        const found = await request(app).get(`/api/schemax/${s.rootid}`);
        expect(found.body.data.json).toEqual(newJson);
    });

    test('update view json_table_config', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        const view = (await request(app).post('/api/viewx')
            .send({ data_schema_id: schema.id, view_type: 'table', json_table_config: { columns: [{ key: 'a' }] } })).body.data;

        const newConfig = { columns: [{ key: 'a', header: 'A' }, { key: 'b', header: 'B' }] };
        await request(app).put(`/api/viewx/${view.rootid}`).send({ json_table_config: newConfig });

        const found = await request(app).get(`/api/viewx/${view.rootid}`);
        expect(found.body.data.json_table_config.columns).toHaveLength(2);
    });

    test('update form json_form_config', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        const cfg = (await request(app).post('/api/formcfgx')
            .send({ data_id: schema.id, json_form_config: { colnumbers: 4, controls: [] } })).body.data;

        await request(app).put(`/api/formcfgx/${cfg.rootid}`)
            .send({ json_form_config: { colnumbers: 6, controls: [{ key: 'x' }] } });

        const found = await request(app).get(`/api/formcfgx/${cfg.rootid}`);
        expect(found.body.data.json_form_config.colnumbers).toBe(6);
        expect(found.body.data.json_form_config.controls).toHaveLength(1);
    });

    test('update data record', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        const record = (await request(app).post('/api/formx')
            .send({ data_schema_id: schema.id, data: { fname: 'Old', age: 20 } })).body.data;

        await request(app).put(`/api/formx/${record.rootid}`)
            .send({ data: { fname: 'New', age: 30 } });

        const found = await request(app).get(`/api/formx/${record.rootid}`);
        expect(found.body.data.data.fname).toBe('New');
        expect(found.body.data.data.age).toBe(30);
    });

    test('update flag field', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        expect(s.flag).toBe('draft');

        await request(app).put(`/api/schemax/${s.rootid}`).send({ flag: 'published' });

        const found = await request(app).get(`/api/schemax/${s.rootid}`);
        expect(found.body.data.flag).toBe('published');
    });
});

// ─── Pagination & Filtering ───

describe('Integration: Pagination & Filtering', () => {
    test('limit and offset', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app).post('/api/schemax').send({ name: `Schema ${i}` });
        }

        // Default — get all 5
        const all = await request(app).get('/api/schemax');
        expect(all.body.data).toHaveLength(5);

        // Limit 2
        const page1 = await request(app).get('/api/schemax?limit=2');
        expect(page1.body.data).toHaveLength(2);

        // Limit 2, offset 2
        const page2 = await request(app).get('/api/schemax?limit=2&offset=2');
        expect(page2.body.data).toHaveLength(2);

        // Offset beyond total
        const empty = await request(app).get('/api/schemax?limit=2&offset=10');
        expect(empty.body.data).toHaveLength(0);
    });

    test('filter by flag', async () => {
        const s1 = (await request(app).post('/api/schemax').send({ name: 'Draft' })).body.data;
        const s2 = (await request(app).post('/api/schemax').send({ name: 'Published', flag: 'published' })).body.data;

        const drafts = await request(app).get('/api/schemax?flag=draft');
        expect(drafts.body.data).toHaveLength(1);
        expect(drafts.body.data[0].name).toBe('Draft');

        const published = await request(app).get('/api/schemax?flag=published');
        expect(published.body.data).toHaveLength(1);
        expect(published.body.data[0].name).toBe('Published');
    });

    test('filter views by data_schema_id', async () => {
        const s1 = (await request(app).post('/api/schemax').send({ name: 'S1' })).body.data;
        const s2 = (await request(app).post('/api/schemax').send({ name: 'S2' })).body.data;

        await request(app).post('/api/viewx').send({ data_schema_id: s1.id, view_type: 'table' });
        await request(app).post('/api/viewx').send({ data_schema_id: s1.id, view_type: 'table' });
        await request(app).post('/api/viewx').send({ data_schema_id: s2.id, view_type: 'table' });

        const viewsS1 = await request(app).get(`/api/viewx?data_schema_id=${s1.id}`);
        expect(viewsS1.body.data).toHaveLength(2);

        const viewsS2 = await request(app).get(`/api/viewx?data_schema_id=${s2.id}`);
        expect(viewsS2.body.data).toHaveLength(1);
    });

    test('filter form configs by data_id', async () => {
        const s1 = (await request(app).post('/api/schemax').send({ name: 'S1' })).body.data;
        const s2 = (await request(app).post('/api/schemax').send({ name: 'S2' })).body.data;

        await request(app).post('/api/formcfgx').send({ data_id: s1.id });
        await request(app).post('/api/formcfgx').send({ data_id: s2.id });
        await request(app).post('/api/formcfgx').send({ data_id: s2.id });

        const cfgsS1 = await request(app).get(`/api/formcfgx?data_id=${s1.id}`);
        expect(cfgsS1.body.data).toHaveLength(1);

        const cfgsS2 = await request(app).get(`/api/formcfgx?data_id=${s2.id}`);
        expect(cfgsS2.body.data).toHaveLength(2);
    });
});

// ─── modify_datetime ───

describe('Integration: modify_datetime', () => {
    test('create sets modify_datetime in yyyymmdd_hhmmss format', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Test' })).body.data;
        expect(s.modify_datetime).toMatch(/^\d{8}_\d{6}$/);
    });

    test('update refreshes modify_datetime', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Test' })).body.data;
        const dt1 = s.modify_datetime;

        await request(app).put(`/api/schemax/${s.rootid}`).send({ name: 'Updated' });

        const found = await request(app).get(`/api/schemax/${s.rootid}`);
        expect(found.body.data.modify_datetime).toMatch(/^\d{8}_\d{6}$/);
    });

    test('soft delete refreshes modify_datetime', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Test' })).body.data;

        const delRes = await request(app).delete(`/api/schemax/${s.rootid}`);
        expect(delRes.body.success).toBe(true);
    });
});

// ─── Validation Edge Cases ───

describe('Integration: Validation Edge Cases', () => {
    test('schemax: name too long (>255 chars)', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: 'x'.repeat(256) });
        expect(res.status).toBe(400);
    });

    test('schemax: name empty string', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: '' });
        expect(res.status).toBe(400);
    });

    test('schemax: prev_id must be positive integer', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: 'Test', prev_id: -1 });
        expect(res.status).toBe(400);
    });

    test('schemax: prev_id cannot be zero', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: 'Test', prev_id: 0 });
        expect(res.status).toBe(400);
    });

    test('schemax: prev_id cannot be float', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: 'Test', prev_id: 1.5 });
        expect(res.status).toBe(400);
    });

    test('viewx: data_schema_id must be positive integer', async () => {
        const res = await request(app)
            .post('/api/viewx')
            .send({ data_schema_id: -5, view_type: 'table' });
        expect(res.status).toBe(400);
    });

    test('viewx: view_type cannot be empty', async () => {
        const res = await request(app)
            .post('/api/viewx')
            .send({ data_schema_id: 1, view_type: '' });
        expect(res.status).toBe(400);
    });

    test('formcfgx: data_id must be positive integer', async () => {
        const res = await request(app)
            .post('/api/formcfgx')
            .send({ data_id: 0 });
        expect(res.status).toBe(400);
    });

    test('formx: flag only accepts active/archived', async () => {
        const res = await request(app)
            .post('/api/formx')
            .send({ data_schema_id: 1, data: {}, flag: 'published' });
        expect(res.status).toBe(400);
    });

    test('schemax: flag accepts draft/published/archived', async () => {
        for (const flag of ['draft', 'published', 'archived']) {
            const res = await request(app)
                .post('/api/schemax')
                .send({ name: `Flag ${flag}`, flag });
            expect(res.status).toBe(201);
        }
    });

    test('formx: flag accepts active/archived', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        for (const flag of ['active', 'archived']) {
            const res = await request(app)
                .post('/api/formx')
                .send({ data_schema_id: schema.id, data: {}, flag });
            expect(res.status).toBe(201);
        }
    });

    test('update with empty body is valid (no required fields)', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Test' })).body.data;
        const res = await request(app).put(`/api/schemax/${s.rootid}`).send({});
        expect(res.status).toBe(200);
    });

    test('extra fields are stripped by Zod', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .send({ name: 'Test', extraField: 'should be stripped', anotherExtra: 123 });
        expect(res.status).toBe(201);
        expect(res.body.data).not.toHaveProperty('extraField');
        expect(res.body.data).not.toHaveProperty('anotherExtra');
    });
});

// ─── Unicode & Special Characters ───

describe('Integration: Unicode & Special Characters', () => {
    test('Thai names in schema', async () => {
        const s = (await request(app).post('/api/schemax')
            .send({ name: 'ฟอร์มลงทะเบียนนักศึกษา' })).body.data;
        expect(s.name).toBe('ฟอร์มลงทะเบียนนักศึกษา');
    });

    test('Thai data in form submission', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        const record = (await request(app).post('/api/formx')
            .send({ data_schema_id: schema.id, data: { fname: 'สมชาย ใจดี', address: 'กรุงเทพฯ' } })).body.data;
        expect(record.data.fname).toBe('สมชาย ใจดี');
        expect(record.data.address).toBe('กรุงเทพฯ');
    });

    test('special characters in json keys', async () => {
        const s = (await request(app).post('/api/schemax')
            .send({ name: 'Test', json: { 'field-with-dash': { type: 'string' }, 'field_with_under': { type: 'number' } } })).body.data;
        expect(s.json).toHaveProperty('field-with-dash');
        expect(s.json).toHaveProperty('field_with_under');
    });
});

// ─── Complex JSON Structures ───

describe('Integration: Complex JSON', () => {
    test('nested json in data_schema', async () => {
        const complexJson = {
            personal: { type: 'string' },
            address: { type: 'string' },
            contacts: { type: 'string' },
            emergency: { type: 'string' },
        };
        const s = (await request(app).post('/api/schemax')
            .send({ name: 'Complex', json: complexJson })).body.data;
        expect(Object.keys(s.json)).toHaveLength(4);
    });

    test('complex json_table_config with all column options', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        const config = {
            columns: [
                { key: 'fname', header: 'ชื่อ', width: 'auto', sortable: true, visible: true },
                { key: 'age', header: 'อายุ', width: '80', sortable: true, visible: true },
                { key: 'email', header: 'อีเมล', width: '200', sortable: false, visible: false },
            ],
        };
        const view = (await request(app).post('/api/viewx')
            .send({ data_schema_id: schema.id, view_type: 'table', json_table_config: config })).body.data;
        expect(view.json_table_config.columns).toHaveLength(3);
        expect(view.json_table_config.columns[2].visible).toBe(false);
    });

    test('complex json_form_config with layout', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        const config = {
            colnumbers: 12,
            controls: [
                { key: 'fname', label: 'ชื่อ', colno: 1, rowno: 1, colspan: 6, placeholder: 'กรอกชื่อ' },
                { key: 'lname', label: 'นามสกุล', colno: 7, rowno: 1, colspan: 6, placeholder: 'กรอกนามสกุล' },
                { key: 'age', label: 'อายุ', colno: 1, rowno: 2, colspan: 3 },
                { key: 'birthday', label: 'วันเกิด', colno: 4, rowno: 2, colspan: 4 },
                { key: 'address', label: 'ที่อยู่', colno: 1, rowno: 3, colspan: 12, placeholder: 'กรอกที่อยู่' },
            ],
        };
        const cfg = (await request(app).post('/api/formcfgx')
            .send({ data_id: schema.id, json_form_config: config })).body.data;
        expect(cfg.json_form_config.colnumbers).toBe(12);
        expect(cfg.json_form_config.controls).toHaveLength(5);
        expect(cfg.json_form_config.controls[4].colspan).toBe(12);
    });

    test('empty json is valid', async () => {
        const s = (await request(app).post('/api/schemax')
            .send({ name: 'Empty', json: {} })).body.data;
        expect(s.json).toEqual({});
    });

    test('data with mixed value types', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        const mixedData = {
            fname: 'John',
            age: 30,
            score: 95.5,
            active: true,
            tags: ['student', 'new'],
            meta: { source: 'web', ref: null },
        };
        const record = (await request(app).post('/api/formx')
            .send({ data_schema_id: schema.id, data: mixedData })).body.data;
        expect(record.data.fname).toBe('John');
        expect(record.data.age).toBe(30);
        expect(record.data.score).toBe(95.5);
        expect(record.data.active).toBe(true);
        expect(record.data.tags).toEqual(['student', 'new']);
        expect(record.data.meta.source).toBe('web');
    });
});

// ─── Auto-increment ID ───

describe('Integration: Auto-increment ID', () => {
    test('IDs increment across creates', async () => {
        const s1 = (await request(app).post('/api/schemax').send({ name: 'S1' })).body.data;
        const s2 = (await request(app).post('/api/schemax').send({ name: 'S2' })).body.data;
        const s3 = (await request(app).post('/api/schemax').send({ name: 'S3' })).body.data;
        expect(s1.id).toBe(1);
        expect(s2.id).toBe(2);
        expect(s3.id).toBe(3);
    });

    test('each table has independent ID counter', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;
        const view = (await request(app).post('/api/viewx')
            .send({ data_schema_id: schema.id, view_type: 'table' })).body.data;
        const cfg = (await request(app).post('/api/formcfgx')
            .send({ data_id: schema.id })).body.data;
        const record = (await request(app).post('/api/formx')
            .send({ data_schema_id: schema.id, data: {} })).body.data;

        expect(schema.id).toBe(1);
        expect(view.id).toBe(1);
        expect(cfg.id).toBe(1);
        expect(record.id).toBe(1);
    });

    test('rootid is unique UUID per record', async () => {
        const s1 = (await request(app).post('/api/schemax').send({ name: 'S1' })).body.data;
        const s2 = (await request(app).post('/api/schemax').send({ name: 'S2' })).body.data;
        expect(s1.rootid).not.toBe(s2.rootid);
    });
});

// ─── Response Envelope Consistency ───

describe('Integration: Response Envelope', () => {
    test('GET list → { success: true, data: [] }', async () => {
        const res = await request(app).get('/api/schemax');
        expect(res.body).toEqual({ success: true, data: [] });
    });

    test('GET single → { success: true, data: {...} }', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Test' })).body.data;
        const res = await request(app).get(`/api/schemax/${s.rootid}`);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.data).toBe('object');
        expect(Array.isArray(res.body.data)).toBe(false);
    });

    test('POST → { success: true, data: {...} }', async () => {
        const res = await request(app).post('/api/schemax').send({ name: 'Test' });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('rootid');
    });

    test('PUT → { success: true, data: {...} }', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Test' })).body.data;
        const res = await request(app).put(`/api/schemax/${s.rootid}`).send({ name: 'Updated' });
        expect(res.body.success).toBe(true);
    });

    test('DELETE → { success: true, data: { message } }', async () => {
        const s = (await request(app).post('/api/schemax').send({ name: 'Test' })).body.data;
        const res = await request(app).delete(`/api/schemax/${s.rootid}`);
        expect(res.body).toEqual({ success: true, data: { message: 'Deleted' } });
    });

    test('404 → { success: false, error: "..." }', async () => {
        const res = await request(app).get('/api/schemax/nonexistent-uuid');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBeDefined();
    });

    test('validation error → { success: false, error, details }', async () => {
        const res = await request(app).post('/api/schemax').send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Validation failed');
        expect(res.body.details).toBeInstanceOf(Array);
        expect(res.body.details[0]).toHaveProperty('field');
        expect(res.body.details[0]).toHaveProperty('message');
    });

    test('unknown route → { success: false, error }', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

// ─── Content-Type & Edge Cases ───

describe('Integration: HTTP Edge Cases', () => {
    test('GET with no content-type header works', async () => {
        const res = await request(app).get('/api/schemax');
        expect(res.status).toBe(200);
    });

    test('POST without content-type still parsed by express.json', async () => {
        const res = await request(app)
            .post('/api/schemax')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ name: 'Test' }));
        expect(res.status).toBe(201);
    });

    test('health endpoint always available', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('ok');
        expect(res.body.data.timestamp).toBeDefined();
    });
});

// ─── Full CRUD Lifecycle per Table ───

describe('Integration: Full CRUD lifecycle', () => {
    test('data_schema: create → read → update → read → delete → 404', async () => {
        // Create
        const created = (await request(app).post('/api/schemax')
            .send({ name: 'Lifecycle', json: { x: { type: 'string' } } })).body.data;
        expect(created.id).toBe(1);

        // Read
        const read1 = (await request(app).get(`/api/schemax/${created.rootid}`)).body.data;
        expect(read1.name).toBe('Lifecycle');

        // Update
        await request(app).put(`/api/schemax/${created.rootid}`).send({ name: 'Updated', flag: 'published' });

        // Read after update
        const read2 = (await request(app).get(`/api/schemax/${created.rootid}`)).body.data;
        expect(read2.name).toBe('Updated');
        expect(read2.flag).toBe('published');

        // Delete
        await request(app).delete(`/api/schemax/${created.rootid}`);

        // Read after delete → 404
        const read3 = await request(app).get(`/api/schemax/${created.rootid}`);
        expect(read3.status).toBe(404);
    });

    test('data: create → read → update → delete → verify empty list', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;

        // Create data
        const record = (await request(app).post('/api/formx')
            .send({ data_schema_id: schema.id, data: { fname: 'John', age: 30 } })).body.data;

        // Read
        const read1 = (await request(app).get(`/api/formx/${record.rootid}`)).body.data;
        expect(read1.data.fname).toBe('John');

        // Update
        await request(app).put(`/api/formx/${record.rootid}`).send({ data: { fname: 'Jane', age: 25 } });
        const read2 = (await request(app).get(`/api/formx/${record.rootid}`)).body.data;
        expect(read2.data.fname).toBe('Jane');

        // Delete
        await request(app).delete(`/api/formx/${record.rootid}`);

        // List should be empty for this schema
        const list = await request(app).get(`/api/formx?data_schema_id=${schema.id}`);
        expect(list.body.data).toHaveLength(0);
    });

    test('view: full lifecycle', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;

        const view = (await request(app).post('/api/viewx')
            .send({ data_schema_id: schema.id, view_type: 'table', name: 'V1', json_table_config: { columns: [] } })).body.data;

        await request(app).put(`/api/viewx/${view.rootid}`)
            .send({ name: 'V1 Updated', json_table_config: { columns: [{ key: 'a' }] } });

        const updated = (await request(app).get(`/api/viewx/${view.rootid}`)).body.data;
        expect(updated.name).toBe('V1 Updated');

        await request(app).delete(`/api/viewx/${view.rootid}`);
        const deleted = await request(app).get(`/api/viewx/${view.rootid}`);
        expect(deleted.status).toBe(404);
    });

    test('form config: full lifecycle', async () => {
        const schema = (await request(app).post('/api/schemax').send({ name: 'S' })).body.data;

        const cfg = (await request(app).post('/api/formcfgx')
            .send({ data_id: schema.id, name: 'F1', json_form_config: { colnumbers: 6, controls: [] } })).body.data;

        await request(app).put(`/api/formcfgx/${cfg.rootid}`)
            .send({ name: 'F1 Updated', json_form_config: { colnumbers: 12, controls: [{ key: 'x' }] } });

        const updated = (await request(app).get(`/api/formcfgx/${cfg.rootid}`)).body.data;
        expect(updated.name).toBe('F1 Updated');
        expect(updated.json_form_config.colnumbers).toBe(12);

        await request(app).delete(`/api/formcfgx/${cfg.rootid}`);
        const deleted = await request(app).get(`/api/formcfgx/${cfg.rootid}`);
        expect(deleted.status).toBe(404);
    });
});
