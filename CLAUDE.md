# RootID Backend — Architecture & API Guide

> อัปเดตล่าสุด: 2026-04-27
> สำหรับทีม dev ที่เข้ามาใหม่ หรือทีมอื่นที่ต้องต่อ API
> (รวมจาก backend.md + DB-DESIGN.md + CLAUDE.md เดิม)

---

## 1. ภาพรวม

RootID เป็น REST API สำหรับระบบ **CakeControl Form Builder** — ระบบสร้างฟอร์มแบบ Google Forms

- **Tech Stack**: Express 5 + Prisma ORM + PostgreSQL 16
- **Port**: 3002
- **ไม่มี auth** — ใช้ฟรี ไม่มี login
- **Frontend**: CakeControl (React 19 + Vite 7) อยู่ที่ `cakecontrol/`

```
Request Flow:

Client (React)
  → POST /api/schemax { name: "...", json: {...} }
  → Express (cors → json → rateLimit)
    → Route (schemax.routes.js)
      → Validate (Zod schema)
        → Controller (base.controller.js)
          → Service (base.service.js)
            → Prisma → PostgreSQL
  ← { success: true, data: { rootid: "...", id: 1, ... } }
```

---

## 2. Project Structure

```
rootid/
├── prisma/
│   └── schema.prisma          # DB schema (4 tables)
├── generated/
│   └── prisma/                # Prisma Client (auto-generated)
├── src/
│   ├── server.js              # Entry point — listen port
│   ├── app.js                 # Express app setup (cors, json, routes, error handler)
│   ├── config/
│   │   └── db.prisma.js       # Prisma Client instance
│   ├── routes/
│   │   ├── index.js           # Mount 4 route files ไปที่ /api/*
│   │   ├── schemax.routes.js  # /api/schemax
│   │   ├── viewx.routes.js    # /api/viewx
│   │   ├── formcfgx.routes.js # /api/formcfgx
│   │   └── formx.routes.js    # /api/formx
│   ├── controllers/
│   │   ├── base.controller.js # Factory — สร้าง controller ทั้ง 5 methods
│   │   ├── schemax.controller.js
│   │   ├── viewx.controller.js
│   │   ├── formcfgx.controller.js
│   │   └── formx.controller.js
│   ├── services/
│   │   ├── base.service.js    # Factory — สร้าง service ทั้ง 5 methods
│   │   ├── schemax.service.js
│   │   ├── viewx.service.js
│   │   ├── formcfgx.service.js
│   │   └── formx.service.js
│   ├── validators/
│   │   ├── schemax.validator.js
│   │   ├── viewx.validator.js
│   │   ├── formcfgx.validator.js
│   │   └── formx.validator.js
│   ├── middlewares/
│   │   ├── validate.middleware.js  # Zod validation
│   │   └── error.middleware.js     # Prisma error mapping
│   ├── utils/
│   │   └── datetime.js        # now() → "yyyymmdd_hhmmss"
│   ├── __mocks__/
│   │   └── prisma.js          # Mock Prisma for tests
│   └── __tests__/
│       └── api.test.js        # 36 tests (supertest)
├── package.json
└── .env                       # DATABASE_URL
```

### Project Structure — node_modules

โปรเจค rootid มี **2 package.json แยกกัน** (แต่ละอันมี node_modules ของตัวเอง):

| โฟลเดอร์ | package.json | หน้าที่ | Dependencies หลัก |
|-----------|-------------|---------|-------------------|
| `rootid/` | `package.json` | Backend API | Express, Prisma, Zod |
| `rootid/benchmark/` | `package.json` | Benchmark tool | raw pg, mongodb |

**ทำไมแยก**: Dependencies ต่างกัน — backend ใช้ Prisma ORM, benchmark ใช้ raw pg driver + mongodb
ถ้ารวมกัน backend จะมี mongodb เป็น dependency ที่ไม่จำเป็น

```bash
# ติดตั้ง backend
cd rootid && npm install

# ติดตั้ง benchmark (แยก)
cd rootid/benchmark && npm install
```

---

## 3. Database Design (4 Tables)

> DB: PostgreSQL 16 | ORM: Prisma
> ไม่มี auth ใช้ฟรี

### Design Principles

1. **rootid** = UUID, PK จริง ไม่เปลี่ยน ใช้อ้างอิงตลอด
2. **id** = auto-increment integer ใช้เป็น FK ระหว่าง tables (เวลาแก้ data แต่ rootid เดิม อิง id แทน)
3. **Default columns ทุก table**: `rootid`, `id`, `prev_id`, `activate`, `flag`, `modify_datetime`
4. **Date format** = VARCHAR ไม่ใช้ TIMESTAMPTZ → `yyyymmdd_hhmmss` เช่น `20260409_143052`
5. **JSONB** = ใช้สำหรับ dynamic schema
6. **ไม่มี auth** = ใช้ฟรี ไม่มี login

### ER Diagram

```
data_schema (1) ──→ (N) view     โชว์ตาราง
data_schema (1) ──→ (N) form     ฟอร์มหน้าตายังไง
data_schema (1) ──→ (N) data     ข้อมูลจริง
```

```
              view (โชว์ตาราง)
                 ↑ N:1
  data    ←── data_schema ──→  form
  N:1            (1)            N:1
ข้อมูลจริง    มี field อะไร   ฟอร์มจัดวางยังไง
```

### Default Columns (ทุก table มี)

| Column | Type | Description |
|--------|------|-------------|
| `rootid` | UUID | PK จริง ไม่เปลี่ยน ใช้เป็น param ใน API |
| `id` | SERIAL | auto-increment ใช้เป็น FK ระหว่าง tables |
| `prev_id` | INT? | versioning — ชี้ไป `id` ของ version ก่อนหน้า |
| `activate` | BOOLEAN | soft delete (true = ยังอยู่, false = ลบแล้ว) |
| `flag` | VARCHAR(50) | สถานะ (draft/published/active/archived) |
| `modify_datetime` | VARCHAR(15) | `yyyymmdd_hhmmss` เช่น `20260422_143052` |

### ทำไม rootid กับ id แยกกัน?

- **rootid** (UUID) = identity ของ record — ไม่เปลี่ยนตลอดชีวิต ใช้เป็น PK และ URL param
- **id** (SERIAL) = auto-increment — ใช้เป็น FK ที่ tables อื่นอ้างถึง และใช้กับ `prev_id` สำหรับ versioning

```
schema v1 (id: 1, prev_id: null)   ← ตัวแรก
    ↑
schema v2 (id: 2, prev_id: 1)     ← แก้ครั้งที่ 1
    ↑
schema v3 (id: 3, prev_id: 2)     ← current
```

### Table 1: data_schema (Schema ของ data)

หน้าที่หลัก: เก็บ format ของ databind ว่า field ไหนเป็น type อะไร

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rootid | UUID | PK, DEFAULT gen_random_uuid() | id แม่ (ไม่เปลี่ยน) |
| id | SERIAL | UNIQUE, NOT NULL | Display ID + ใช้เป็น FK |
| prev_id | INT | FK → data_schema(id), NULLABLE | lineage (version ก่อนหน้า) |
| name | VARCHAR(255) | NOT NULL | ชื่อ schema |
| json | JSONB | NOT NULL DEFAULT '{}' | field definitions (key + type) |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published / archived |
| activate | BOOLEAN | DEFAULT true | soft delete (d = default) |
| modify_datetime | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE data_schema (
    rootid              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    prev_id             INT REFERENCES data_schema(id),
    name                VARCHAR(255) NOT NULL,
    json                JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modify_datetime     VARCHAR(15)
);

CREATE INDEX idx_data_schema_flag ON data_schema(flag);
CREATE INDEX idx_data_schema_prev ON data_schema(prev_id);
```

**json format** (เช็ค format ของ databind):
```json
{
    "fname": { "type": "string" },
    "age": { "type": "number" },
    "birthday": { "type": "yymmdd" },
    "start_time": { "type": "hhmm" },
    "created_at": { "type": "yymmddhhmmhh" }
}
```

**Supported types**:
| type | description |
|------|-----------|
| string | ข้อความ |
| number | ตัวเลข |
| yymmdd | วันที่ (ปีเดือนวัน) |
| hhmm | เวลา (ชั่วโมงนาที) |
| yymmddhhmmhh | วันที่+เวลา |

### Table 2: data (Data จริงๆ)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rootid | UUID | PK | id แม่ |
| id | SERIAL | UNIQUE | Display ID |
| prev_id | INT | FK → data(id), NULLABLE | lineage |
| data_schema_id | INT | FK → data_schema(id), NOT NULL | fk schema |
| data | JSONB | NOT NULL DEFAULT '{}' | ข้อมูลจริง |
| flag | VARCHAR(50) | DEFAULT 'active' | active / archived |
| activate | BOOLEAN | DEFAULT true | soft delete (d) |
| modify_datetime | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE data (
    rootid              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    prev_id             INT REFERENCES data(id),
    data_schema_id      INT NOT NULL REFERENCES data_schema(id),
    data                JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'active',
    activate            BOOLEAN DEFAULT true,
    modify_datetime     VARCHAR(15)
);

CREATE INDEX idx_data_schema ON data(data_schema_id);
CREATE INDEX idx_data_activate ON data(activate);
CREATE INDEX idx_data_json ON data USING GIN(data);
```

**data example**:
```json
{
    "fname": "xxx",
    "age": 28
}
```

### Table 3: view (หน้าตาแถว record ที่ไปแสดงบนตาราง)

CakeControl ตัว table view — ต้องพยายาม map เช่น เพศก่อนหน้านี้เป็น string ชาย หญิง แล้วอยากเป็น 0 1

> **หมายเหตุ**: field format schema id ไม่ตรงบอกมีการ update — เอาง่ายๆ ตอนนี้แสดงเป็น string ไปก่อน

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rootid | UUID | PK | id แม่ |
| id | SERIAL | UNIQUE | Display ID |
| prev_id | INT | FK → view(id), NULLABLE | lineage |
| data_schema_id | INT | FK → data_schema(id), NOT NULL | fk schema |
| view_type | VARCHAR(50) | NOT NULL | 'table' *(เก็บไว้ก่อน — อาจลบทีหลัง)* |
| name | VARCHAR(255) | | ชื่อ view *(เก็บไว้ก่อน — อาจลบทีหลัง)* |
| json_table_config | JSONB | NOT NULL DEFAULT '{}' | columns config |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published |
| activate | BOOLEAN | DEFAULT true | soft delete (d) |
| modify_datetime | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE view (
    rootid              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    prev_id             INT REFERENCES view(id),
    data_schema_id      INT NOT NULL REFERENCES data_schema(id),
    view_type           VARCHAR(50) NOT NULL,
    name                VARCHAR(255),
    json_table_config   JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modify_datetime     VARCHAR(15)
);

CREATE INDEX idx_view_schema ON view(data_schema_id);
CREATE INDEX idx_view_type ON view(view_type);
```

**json_table_config format** (table columns config):
```json
{
    "columns": [
        { "key": "fname", "header": "ชื่อ", "width": "auto", "sortable": true },
        { "key": "age", "header": "อายุ", "width": "80", "sortable": true }
    ]
}
```

### Table 4: form (หน้าตา form บันทึก)

FK `data_id` ชี้ไปที่ `data_schema(id)` — form config เป็น per-schema ไม่ใช่ per-record

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rootid | UUID | PK | id แม่ |
| id | SERIAL | UNIQUE | Display ID |
| prev_id | INT | FK → form(id), NULLABLE | lineage |
| data_id | INT | FK → data_schema(id), NOT NULL | fk schema |
| name | VARCHAR(255) | | ชื่อ form config |
| json_form_config | JSONB | NOT NULL DEFAULT '{}' | form layout config |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published |
| activate | BOOLEAN | DEFAULT true | soft delete (d) |
| modify_datetime | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE form (
    rootid              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    prev_id             INT REFERENCES form(id),
    data_id             INT NOT NULL REFERENCES data_schema(id),
    name                VARCHAR(255),
    json_form_config    JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modify_datetime     VARCHAR(15)
);

CREATE INDEX idx_form_data ON form(data_id);
```

**json_form_config format** (form layout):
```json
{
    "colnumbers": 6,
    "controls": [
        { "key": "fname", "label": "ชื่อ-นามสกุล", "colno": 1, "rowno": 1, "colspan": 6, "placeholder": "กรอกชื่อ" },
        { "key": "age", "label": "อายุ", "colno": 1, "rowno": 2, "colspan": 3 }
    ]
}
```

### Prisma Schema

```prisma
model data_schema {
  rootid           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  id               Int      @unique @default(autoincrement())
  prev_id          Int?
  name             String   @db.VarChar(255)
  json             Json     @default("{}")
  flag             String?  @default("draft") @db.VarChar(50)
  activate         Boolean  @default(true)
  modify_datetime  String?  @db.VarChar(15)

  views            view[]
  forms            form[]
  records          data[]
}

model view {
  rootid            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  id                Int      @unique @default(autoincrement())
  data_schema_id    Int
  json_table_config Json     @default("{}")
  // ... (rootid, prev_id, flag, activate, modify_datetime เหมือนกันทุก table)

  schema            data_schema @relation(fields: [data_schema_id], references: [id])
}

model form {
  rootid            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  id                Int      @unique @default(autoincrement())
  data_id           Int                     // FK ชี้ไป data_schema.id
  json_form_config  Json     @default("{}")
  // ...

  schema            data_schema @relation(fields: [data_id], references: [id])
}

model data {
  rootid            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  id                Int      @unique @default(autoincrement())
  data_schema_id    Int
  data              Json     @default("{}")
  // ...

  schema            data_schema @relation(fields: [data_schema_id], references: [id])
}
```

### DB Flow

```
data_schema (เช็ค format: fname=string, age=number)
     ↓
view (โชว์ตารางยังไง: json_table_config)
form (ฟอร์มหน้าตายังไง: json_form_config)
     ↓ generate
json_table_config → CRUDControl → TableviewControl
json_form_config  → CRUDControl → FormControl + ModalControl
     ↓
data (เก็บข้อมูลจริง)
```

### Table Summary

| Table | หน้าที่ | JSONB column | FK อิง |
|-------|--------|-------------|--------|
| data_schema | เช็ค format (key + type) | json (field defs) | - |
| data | ข้อมูลจริง | data (form entries) | data_schema.id via `data_schema_id` |
| view | โชว์ตาราง | json_table_config | data_schema.id via `data_schema_id` |
| form | form config (label, layout) | json_form_config | data_schema.id via `data_id` |

---

## 4. Architecture Pattern — Factory

หัวใจของ backend คือ **Factory Pattern** — เขียน logic ครั้งเดียวใน `base.service.js` / `base.controller.js` แล้วแต่ละ table เรียกใช้ 1 บรรทัด

### base.service.js — Business Logic Factory

```js
// src/services/base.service.js

const prisma = require('../config/db.prisma');
const { now } = require('../utils/datetime');

function createBaseService(modelName, options = {}) {
  const model = prisma[modelName];   // เช่น prisma.data_schema, prisma.view
  const { fkField } = options;       // FK filter เช่น 'data_schema_id'

  const findAll = (query) => {
    const where = { activate: true };
    // ถ้ามี fkField ก็ filter ตาม FK ใน query string
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
```

### แต่ละ table service = 1 บรรทัด

```js
// schemax.service.js — ไม่มี FK filter
module.exports = createBaseService('data_schema');

// viewx.service.js — filter ด้วย data_schema_id
module.exports = createBaseService('view', { fkField: 'data_schema_id' });

// formcfgx.service.js — filter ด้วย data_id
module.exports = createBaseService('form', { fkField: 'data_id' });

// formx.service.js — filter ด้วย data_schema_id
module.exports = createBaseService('data', { fkField: 'data_schema_id' });
```

### base.controller.js — HTTP Layer Factory

```js
// src/controllers/base.controller.js

function createBaseController(service) {
  const findAll = async (req, res, next) => {
    try {
      const data = await service.findAll(req.query);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  const findOne = async (req, res, next) => {
    try {
      const data = await service.findByRootId(req.params.rootid);
      if (!data) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  const create = async (req, res, next) => {
    try {
      const data = await service.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };

  const update = async (req, res, next) => {
    try {
      const data = await service.update(req.params.rootid, req.body);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  const remove = async (req, res, next) => {
    try {
      await service.softDelete(req.params.rootid);
      res.json({ success: true, data: { message: 'Deleted' } });
    } catch (err) { next(err); }
  };

  return { findAll, findOne, create, update, remove };
}
```

### แต่ละ table controller = 2 บรรทัด

```js
// schemax.controller.js
const service = require('../services/schemax.service');
module.exports = createBaseController(service);
```

### สรุป: เพิ่ม table ใหม่ต้องทำอะไร?

1. เพิ่ม model ใน `prisma/schema.prisma`
2. สร้าง `xxx.service.js` — 1 บรรทัด
3. สร้าง `xxx.controller.js` — 2 บรรทัด
4. สร้าง `xxx.validator.js` — Zod schema
5. สร้าง `xxx.routes.js` — mount 5 routes
6. เพิ่ม `router.use('/xxx', ...)` ใน `routes/index.js`

---

## 5. Routes & Middleware

### Route Registration

```js
// src/routes/index.js
router.use('/schemax', require('./schemax.routes'));
router.use('/viewx', require('./viewx.routes'));
router.use('/formcfgx', require('./formcfgx.routes'));
router.use('/formx', require('./formx.routes'));
```

### Route File Pattern (ทุกไฟล์เหมือนกัน)

```js
// src/routes/schemax.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/schemax.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createSchema, updateSchema } = require('../validators/schemax.validator');

router.get('/',        ctrl.findAll);               // GET  /api/schemax
router.get('/:rootid', ctrl.findOne);               // GET  /api/schemax/:rootid
router.post('/',       validate(createSchema), ctrl.create);   // POST /api/schemax
router.put('/:rootid', validate(updateSchema), ctrl.update);   // PUT  /api/schemax/:rootid
router.delete('/:rootid', ctrl.remove);             // DELETE /api/schemax/:rootid
```

### Middleware Stack

```
Request
  → cors (allow localhost:3000, 5173)
  → express.json (limit 1mb)
  → express-rate-limit (200 req/min)
  → route matching
    → validate middleware (Zod) — POST/PUT only
      → controller
        → service → Prisma → DB
  → error middleware (catch Prisma errors)
Response
```

### Validate Middleware

```js
// src/middlewares/validate.middleware.js
function validate(schema) {
  return (req, res, next) => {
    let result;
    try {
      result = schema.safeParse(req.body);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: [{ field: '', message: err.message }],
      });
    }
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: result.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      });
    }
    req.body = result.data;  // replace body with parsed+cleaned data
    next();
  };
}
```

### Error Middleware

```js
// src/middlewares/error.middleware.js
// Map Prisma errors → HTTP status codes
// P2025 → 404 (Record not found)
// P2002 → 409 (Duplicate)
// P2003 → 400 (Invalid FK reference)
// อื่นๆ → 500
```

---

## 6. Validation (Zod)

แต่ละ table มี 2 schemas: `createSchema` (POST) กับ `updateSchema` (PUT)

### schemax (data_schema)

```js
// POST — name ต้องมี, json default {}
createSchema = z.object({
  name: z.string().min(1).max(255),
  json: z.any().default({}),
  flag: z.enum(['draft', 'published', 'archived']).optional(),
  prev_id: z.number().int().positive().optional(),
});

// PUT — ทุก field optional
updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  json: z.any().optional(),
  flag: z.enum(['draft', 'published', 'archived']).optional(),
  prev_id: z.number().int().positive().optional(),
});
```

### viewx (view)

```js
createSchema = z.object({
  data_schema_id: z.number().int().positive(),     // required FK
  view_type: z.string().min(1).max(50),            // required
  name: z.string().max(255).optional(),
  json_table_config: z.any().default({}),
  flag: z.enum(['draft', 'published']).optional(),
  prev_id: z.number().int().positive().optional(),
});
```

### formcfgx (form)

```js
createSchema = z.object({
  data_id: z.number().int().positive(),            // required FK → data_schema.id
  name: z.string().max(255).optional(),
  json_form_config: z.any().default({}),
  flag: z.enum(['draft', 'published']).optional(),
  prev_id: z.number().int().positive().optional(),
});
```

### formx (data)

```js
createSchema = z.object({
  data_schema_id: z.number().int().positive(),     // required FK
  data: z.any().default({}),
  flag: z.enum(['active', 'archived']).optional(),  // !! flag ต่างจาก table อื่น
  prev_id: z.number().int().positive().optional(),
});
```

---

## 7. API Response Format

**ทุก endpoint ใช้ format เดียวกัน** — FE อ่าน `res.body.success` แล้วเอา `res.body.data`:

### Success

```json
{
  "success": true,
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    { "field": "name", "message": "Required" }
  ]
}
```

### HTTP Status Codes

| Code | เมื่อไหร่ |
|------|----------|
| 200 | GET, PUT, DELETE สำเร็จ |
| 201 | POST สร้างสำเร็จ |
| 400 | Validation failed / Invalid FK / Invalid data |
| 404 | ไม่เจอ record (rootid ไม่มี หรือ activate=false) |
| 409 | Duplicate record |
| 500 | Internal error |

---

## 8. API Reference

### Health Check

```
GET /api/health
→ { success: true, data: { status: "ok", timestamp: "..." } }
```

### data_schema — `/api/schemax`

```
GET    /api/schemax                          ดึงทั้งหมด (activate=true)
GET    /api/schemax?flag=published           filter by flag
GET    /api/schemax?limit=10&offset=0        pagination
GET    /api/schemax/:rootid                  ดึงตัวเดียว by UUID

POST   /api/schemax                          สร้างใหม่
       Body: { "name": "ฟอร์มลงทะเบียน", "json": { "fname": { "type": "string" }, "age": { "type": "number" } } }
       → 201 { success: true, data: { rootid: "uuid...", id: 1, ... } }

PUT    /api/schemax/:rootid                  อัปเดต
       Body: { "name": "ชื่อใหม่" }

DELETE /api/schemax/:rootid                  soft delete (set activate=false)
```

### view — `/api/viewx`

```
GET    /api/viewx?data_schema_id=1           ดึง views ของ schema id=1

POST   /api/viewx
       Body: {
         "data_schema_id": 1,
         "view_type": "table",
         "name": "Default View",
         "json_table_config": {
           "columns": [
             { "key": "fname", "header": "ชื่อ", "width": "auto", "sortable": true },
             { "key": "age",   "header": "อายุ", "width": "80",   "sortable": true }
           ]
         }
       }

PUT    /api/viewx/:rootid
       Body: { "json_table_config": { "columns": [...] } }
```

### form — `/api/formcfgx`

```
GET    /api/formcfgx?data_id=1               ดึง form configs ของ schema id=1

POST   /api/formcfgx
       Body: {
         "data_id": 1,
         "name": "Default Form",
         "json_form_config": {
           "colnumbers": 6,
           "controls": [
             { "key": "fname", "label": "ชื่อ-นามสกุล", "colno": 1, "rowno": 1, "colspan": 6, "placeholder": "กรอกชื่อ" },
             { "key": "age",   "label": "อายุ",         "colno": 1, "rowno": 2, "colspan": 3 }
           ]
         }
       }

PUT    /api/formcfgx/:rootid
       Body: { "json_form_config": { ... } }
```

### data — `/api/formx`

```
GET    /api/formx?data_schema_id=1            ดึงข้อมูลจริงของ schema id=1

POST   /api/formx
       Body: {
         "data_schema_id": 1,
         "data": { "fname": "สมชาย", "age": 28 }
       }

PUT    /api/formx/:rootid
       Body: { "data": { "fname": "สมหญิง", "age": 25 } }

DELETE /api/formx/:rootid
```

---

## 9. Soft Delete & Filtering

- **DELETE** ไม่ลบจริง — แค่ set `activate = false`
- **GET** ทุก endpoint filter `activate = true` อัตโนมัติ — record ที่ถูก delete จะไม่โผล่
- ถ้าอยากดู record ที่ลบแล้ว → ต้อง query DB ตรง (ยังไม่มี API)

```js
// base.service.js — findAll เอาเฉพาะ activate=true
const findAll = (query) => {
  const where = { activate: true };
  // ...
};
```

---

## 10. Versioning (prev_id)

ทุก table รองรับ versioning ผ่าน `prev_id`:

```
POST /api/schemax   { name: "V1", json: {...} }                → id: 1
POST /api/schemax   { name: "V2", json: {...}, prev_id: 1 }    → id: 2
POST /api/schemax   { name: "V3", json: {...}, prev_id: 2 }    → id: 3
```

ตอนนี้ backend ยังไม่มี endpoint สำหรับ query version chain — `prev_id` เก็บไว้เพื่อใช้ในอนาคต

---

## 11. Testing

### Run Tests

```bash
npm test
# → Jest 30 + supertest — 95 tests (36 unit + 59 integration), ~2 seconds
```

### Test Strategy

- **Unit tests** (36 tests) — Mock Prisma ที่ `src/__mocks__/prisma.js`, ยิง HTTP ด้วย supertest
- **Integration tests** (59 tests) — ใช้ `prismaStateful` mock ที่จำลอง DB state จริง (in-memory), ทดสอบ flow ข้าม tables

### Test Coverage — Unit Tests (36)

| กลุ่ม | จำนวน | ทดสอบอะไร |
|-------|-------|----------|
| Health + 404 | 2 | health endpoint, unknown route |
| schemax CRUD | 8 | GET list, GET by id, GET 404, POST, POST validation, PUT, DELETE, flag enum, prev_id |
| viewx CRUD | 6 | GET, GET filter FK, POST, POST validate FK, POST validate view_type, PUT |
| formcfgx CRUD | 6 | GET, GET filter FK, POST, POST validate FK, PUT, DELETE |
| formx CRUD | 7 | GET, GET filter FK, POST, POST validate FK, PUT, DELETE, flag enum |
| Response format | 2 | success format, error format |
| DB column naming | 4 | ตรวจว่า column names ตรง DB design |

### Test Coverage — Integration Tests (59)

| กลุ่ม | จำนวน | ทดสอบอะไร |
|-------|-------|----------|
| schemax integration | ~15 | Full CRUD flow, pagination, flag filter, soft delete |
| viewx integration | ~14 | CRUD + FK filter, data_schema_id reference |
| formcfgx integration | ~14 | CRUD + FK filter, data_id reference |
| formx integration | ~16 | CRUD + FK filter, data_schema_id reference |

### ตัวอย่าง Test

```js
// Mock Prisma แล้ว inject
const mockPrisma = require('../__mocks__/prisma');
jest.mock('../config/db.prisma', () => mockPrisma);
const request = require('supertest');
const app = require('../app');

test('POST / creates schema', async () => {
    mockPrisma.data_schema.create.mockResolvedValue({
        rootid: 'uuid-1', id: 1, name: 'Test Schema',
        json: { fname: { type: 'string' } },
    });
    const res = await request(app)
        .post('/api/schemax')
        .send({ name: 'Test Schema', json: { fname: { type: 'string' } } });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test Schema');
});
```

---

## 12. Setup & Commands

### Prerequisites

- Node.js 22+
- PostgreSQL 16+

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Setup .env
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/rootid"' > .env

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Run migrations
npm run prisma:migrate

# 5. Start dev server
npm run dev
# → http://localhost:3002

# 6. Run tests
npm test
```

### Available Scripts

| Script | คำอธิบาย |
|--------|---------|
| `npm start` | Production server |
| `npm run dev` | Dev server (nodemon — auto-reload) |
| `npm test` | Run all tests |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run DB migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

---

## 13. Naming Conventions

| สิ่งที่ | Convention | ตัวอย่าง |
|--------|-----------|---------|
| API route | suffix `x` | `/api/schemax`, `/api/viewx` |
| URL param | `rootid` (UUID) | `GET /api/schemax/:rootid` |
| File names | `xxx.controller.js`, `xxx.service.js` | `schemax.controller.js` |
| DB column | snake_case | `data_schema_id`, `json_table_config` |
| Date format | `yyyymmdd_hhmmss` VARCHAR(15) | `20260422_143052` |

---

## 14. Diagram สรุป

```
┌─────────────────────────────────────────────────────────────┐
│                        Express App                          │
│                                                             │
│  ┌─── Routes ──────────────────────────────────────────┐    │
│  │  /api/schemax  → schemax.routes.js                  │    │
│  │  /api/viewx    → viewx.routes.js                    │    │
│  │  /api/formcfgx → formcfgx.routes.js                 │    │
│  │  /api/formx    → formx.routes.js                    │    │
│  └─────────────────────────────────────────────────────┘    │
│           │                                                  │
│           ▼                                                  │
│  ┌─── Middleware ──────────────────────────────────────┐    │
│  │  validate.middleware.js  (Zod — POST/PUT only)      │    │
│  │  error.middleware.js     (Prisma error → HTTP)      │    │
│  └─────────────────────────────────────────────────────┘    │
│           │                                                  │
│           ▼                                                  │
│  ┌─── Controllers (Factory) ──────────────────────────┐    │
│  │  base.controller.js → createBaseController(service) │    │
│  │  ├── findAll   → service.findAll(query)             │    │
│  │  ├── findOne   → service.findByRootId(rootid)       │    │
│  │  ├── create    → service.create(body)               │    │
│  │  ├── update    → service.update(rootid, body)       │    │
│  │  └── remove    → service.softDelete(rootid)         │    │
│  └─────────────────────────────────────────────────────┘    │
│           │                                                  │
│           ▼                                                  │
│  ┌─── Services (Factory) ─────────────────────────────┐    │
│  │  base.service.js → createBaseService(model, opts)   │    │
│  │  ├── data_schema  (no FK filter)                    │    │
│  │  ├── view         (fkField: 'data_schema_id')       │    │
│  │  ├── form         (fkField: 'data_id')              │    │
│  │  └── data         (fkField: 'data_schema_id')       │    │
│  └─────────────────────────────────────────────────────┘    │
│           │                                                  │
│           ▼                                                  │
│  ┌─── Prisma ─────────────────────────────────────────┐    │
│  │  db.prisma.js → PrismaClient + PrismaPg adapter    │    │
│  └─────────────────────────────────────────────────────┘    │
│           │                                                  │
│           ▼                                                  │
│       PostgreSQL                                             │
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │data_schema│  view    │  form    │  data    │              │
│  └──────────┴──────────┴──────────┴──────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## Benchmark (อยู่ที่ rootid/benchmark/)

วัด execution time + storage ของระบบจริง rootid
- เปรียบเทียบ 3 แบบ: PG Relational vs MongoDB vs PG JSONB-only
- Data: Wikipedia revision data (58 categories, 399 pages, 3,657 revisions, 252 MB)
- DB: PostgreSQL 18 (port 5432, pass 1234) + MongoDB 8.2 (port 27017, no auth)

### วิธีรัน Benchmark
```bash
cd rootid/benchmark
npm install          # ครั้งแรก
npm start            # เปิด http://localhost:3003 แล้วกด Run
```

ดู `benchmark/CLAUDE.md` สำหรับรายละเอียดทั้งหมด

---

## Communication Rules
- ตอบตรงๆ ไม่อวย
- สงสัยก็ถาม
- แนะนำ 3 ข้อ
- ไม่มีก็บอกไม่มี
