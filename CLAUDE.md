# RootID — Claude Context

## Project Overview
Express.js Backend API สำหรับ CakeControl Form Builder system
ใช้ PostgreSQL (Prisma)
ไม่มี auth ใช้ฟรี

## Tech Stack
- Express 5, Node.js
- Prisma (PostgreSQL) — 4 tables
- Zod validation
- Port: 3002

## Project Structure
```
src/
├── config/          # db.prisma.js
├── controllers/     # base.controller.js + 4 table controllers
├── services/        # base.service.js + 4 table services
├── routes/          # index.js + 4 table routes
├── validators/      # Zod schemas per table
├── middlewares/     # error handler, validate middleware
├── utils/           # datetime helper
├── app.js           # Express app setup
└── server.js        # Entry point
prisma/
└── schema.prisma    # 4 tables: data_schema, view, form, data
```

## Architecture Pattern
- **Factory pattern**: `createBaseService(modelName, options)` + `createBaseController(service)`
- แต่ละ table service/controller เป็น 1-liner ที่เรียก factory
- Validators ใช้ Zod schemas

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| CRUD | /api/schemax | data_schema table |
| CRUD | /api/viewx | view table |
| CRUD | /api/formcfgx | form table (config) |
| CRUD | /api/formx | data table |

Each CRUD: GET /, GET /:rootid, POST /, PUT /:rootid, DELETE /:rootid

## DB Design (4 tables) — ดู cakecontrol/DB-DESIGN.md สำหรับ full detail

**Design Principles**:
- `rootid` = UUID PK ไม่เปลี่ยน
- `id` = SERIAL ใช้เป็น FK
- `prev_id` อิง `id` (versioning via linked list)
- Date format: VARCHAR `yyyymmdd_hhmmss`
- Default columns ทุก table: `rootid`, `id`, `prev_id`, `activate`, `flag`, `modify_datetime`

**Tables**:
| Table | Prisma model | FK column | JSON column |
|-------|-------------|-----------|-------------|
| data_schema | data_schema | - | json |
| view | view | data_schema_id | json_table_config |
| form | form | data_id → data_schema | json_form_config |
| data | data | data_schema_id | data |

**Supported types**: string, number, yymmdd, hhmm, yymmddhhmmhh

## Naming Conventions
- API routes: suffix `x` (schemax, viewx, formcfgx, formx)
- Files: `xxx.controller.js`, `xxx.service.js`, `xxx.routes.js`, `xxx.validator.js`
- DB: soft delete via `activate` field
- Date format: `yyyymmdd_hhmmss` (VARCHAR)
- PK param: `:rootid` (UUID)

## Benchmark (อยู่ที่ rootid/benchmark/)
วัด execution time + storage ของระบบจริง rootid
- เปรียบเทียบ 3 แบบ: PG Relational vs MongoDB vs PG JSONB-only
- Input: k (columns), n (rows)
- DB: PostgreSQL 18 (port 5433, pass 1234) + MongoDB 8.2 (port 27017, no auth)

## Communication Rules
- ตอบตรงๆ ไม่อวย
- สงสัยก็ถาม
- แนะนำ 3 ข้อ
- ไม่มีก็บอกไม่มี
