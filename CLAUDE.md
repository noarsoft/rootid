# RootID Backend — Architecture & API Guide

## Overview

REST API for the **CakeControl Form Builder** — a dynamic form system like Google Forms.

- **Tech Stack**: Express 5 + Prisma ORM + PostgreSQL 16
- **Port**: 3002
- **No auth** — free to use, no login
- **Frontend**: CakeControl (React 19 + Vite 7) at `cakecontrol/`

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

## Project Structure

```
rootid/
├── prisma/
│   └── schema.prisma          # DB schema (5 tables)
├── generated/
│   └── prisma/                # Prisma Client (auto-generated)
├── src/
│   ├── server.js              # Entry point — listen port
│   ├── app.js                 # Express app setup (cors, json, routes, error handler)
│   ├── config/
│   │   └── db.prisma.js       # Prisma Client instance
│   ├── routes/
│   │   ├── index.js           # Mount route files at /api/*
│   │   ├── schemax.routes.js  # /api/schemax
│   │   ├── viewx.routes.js    # /api/viewx
│   │   ├── formcfgx.routes.js # /api/formcfgx
│   │   └── formx.routes.js    # /api/formx
│   ├── controllers/
│   │   ├── base.controller.js # Factory — creates controller with 6 methods
│   │   └── *.controller.js    # Per-table (1-2 lines each)
│   ├── services/
│   │   ├── base.service.js    # Factory — creates service with 6 methods
│   │   └── *.service.js       # Per-table (1 line each)
│   ├── validators/            # Zod schemas per table
│   ├── middlewares/
│   │   ├── validate.middleware.js  # Zod validation
│   │   └── error.middleware.js     # Prisma error mapping
│   ├── utils/
│   │   └── datetime.js        # now() → 14-digit BigInt (20260422143052)
│   ├── __mocks__/
│   │   └── prisma.js          # Mock Prisma for tests
│   └── __tests__/
│       └── api.test.js        # 95 tests (supertest)
├── benchmark/                 # Separate sub-project (own package.json)
├── package.json
└── .env                       # DATABASE_URL
```

### Sub-projects

| Directory | package.json | Purpose | Key deps |
|-----------|-------------|---------|----------|
| `rootid/` | `package.json` | Backend API | Express, Prisma, Zod |
| `rootid/benchmark/` | `package.json` | Benchmark tool | raw pg, mongodb |

Separate because dependencies differ — benchmark uses raw pg driver + mongodb, backend uses Prisma ORM.

---

## Database Design (5 Tables)

### Design Principles

1. **rootid** = UUID, PK, never changes, used in API URLs
2. **id** = auto-increment integer, used as FK between tables
3. **Default columns every table**: `rootid`, `id`, `prev_id`, `activate`, `flag`, `modify_datetime`
4. **modify_datetime** = BigInt, 14-digit UTC number (e.g. `20260422143052`)
5. **JSONB** for dynamic schema
6. **No auth**
7. **Append-only versioning** — updates create new records, never mutate existing ones

### ER Diagram

```
business (1) ──→ (N) data_schema
data_schema (1) ──→ (N) view      (table display config)
data_schema (1) ──→ (N) form      (form layout config)
data_schema (1) ──→ (N) data      (actual records)
```

### Default Columns (every table)

| Column | Type | Description |
|--------|------|-------------|
| `rootid` | UUID | PK, never changes, used as API param |
| `id` | SERIAL | Auto-increment, used as FK between tables |
| `prev_id` | INT? | Versioning — points to `id` of previous version |
| `activate` | BOOLEAN | Soft delete (true = active, false = deleted/superseded) |
| `flag` | VARCHAR(50) | Status (draft/published/active/archived/deleted) |
| `modify_datetime` | BIGINT | 14-digit UTC number (`20260422143052`) |

### Why rootid and id are separate

- **rootid** (UUID) = identity — never changes, used as PK and URL param
- **id** (SERIAL) = auto-increment — used as FK and for `prev_id` versioning

```
schema v1 (id: 1, prev_id: null)   ← first version
    ↑
schema v2 (id: 2, prev_id: 1)     ← edited once
    ↑
schema v3 (id: 3, prev_id: 2)     ← current
```

### Table 1: business

| Column | Type | Description |
|--------|------|-------------|
| rootid | UUID | PK |
| id | SERIAL | FK reference |
| name | VARCHAR(255) | Business name |
| icon | VARCHAR(100)? | Icon identifier |
| flag | VARCHAR(50) | Default 'active' |

### Table 2: data_schema

Stores field format definitions (which fields exist and their types).

| Column | Type | Description |
|--------|------|-------------|
| rootid | UUID | PK |
| id | SERIAL | FK reference |
| business_id | INT? | FK → business(id) |
| name | VARCHAR(255) | Schema name |
| json | JSONB | Field definitions (key + type) |
| flag | VARCHAR(50) | draft / published / archived |

**json format**:
```json
{
    "fname": { "type": "string" },
    "age": { "type": "number" },
    "birthday": { "type": "yymmdd" }
}
```

**Supported types**: string, number, yymmdd, hhmm, yymmddhhmmhh

### Table 3: view

Table display configuration.

| Column | Type | Description |
|--------|------|-------------|
| data_schema_id | INT | FK → data_schema(id) |
| view_type | VARCHAR(50) | 'table' |
| json_table_config | JSONB | Columns config |

### Table 4: form

Form layout configuration. FK `data_id` points to `data_schema(id)`.

| Column | Type | Description |
|--------|------|-------------|
| data_id | INT | FK → data_schema(id) |
| json_form_config | JSONB | Form layout config |

### Table 5: data

Actual user data records.

| Column | Type | Description |
|--------|------|-------------|
| data_schema_id | INT | FK → data_schema(id) |
| data | JSONB | Actual form data |
| flag | VARCHAR(50) | active / archived |

---

## Append-Only Versioning

All tables implement append-only versioning:

### Update (creates new version)

1. Deactivate current record (`activate=false`)
2. Create new record with `prev_id` pointing to old `id`
3. If `childFks` configured, cascade FK updates to child tables

### Soft Delete (creates tombstone)

1. Deactivate current record (`activate=false`)
2. Create tombstone record (`activate=false, flag='deleted'`, `prev_id` = old `id`)

### History

`GET /:rootid/history` — returns version chain by walking `prev_id` links.

---

## Architecture Pattern — Factory

Core pattern: write logic once in `base.service.js` / `base.controller.js`, each table calls it in 1 line.

### Service Factory

```js
// Each table service = 1 line
module.exports = createBaseService('data_schema');                                    // schemax
module.exports = createBaseService('view', { fkField: 'data_schema_id' });           // viewx
module.exports = createBaseService('form', { fkField: 'data_id' });                  // formcfgx
module.exports = createBaseService('data', { fkField: 'data_schema_id' });           // formx
```

### Service Methods (6)

| Method | Description |
|--------|-------------|
| `findAll(query)` | List records (activate=true), filter by FK and flag, paginate |
| `findByRootId(rootid)` | Find single record by UUID |
| `create(data)` | Create new record |
| `update(rootid, data)` | Append-only: deactivate old → create new with prev_id |
| `softDelete(rootid)` | Create tombstone record |
| `findHistory(rootid)` | Walk prev_id chain for version history |

### Controller Factory

Each table controller = 2 lines:
```js
const service = require('../services/schemax.service');
module.exports = createBaseController(service);
```

### Adding a new table

1. Add model in `prisma/schema.prisma`
2. Create `xxx.service.js` — 1 line
3. Create `xxx.controller.js` — 2 lines
4. Create `xxx.validator.js` — Zod schema
5. Create `xxx.routes.js` — mount routes
6. Add `router.use('/xxx', ...)` in `routes/index.js`

---

## Routes & Middleware

### Middleware Stack

```
Request
  → cors (allow localhost:3000, 5173)
  → express.json (limit 1mb)
  → express-rate-limit (200 req/min)
  → route matching
    → validate middleware (Zod) — POST/PUT only
      → controller → service → Prisma → DB
  → error middleware (catch Prisma errors)
Response
```

---

## API Response Format

Every endpoint uses the same format:

### Success

```json
{ "success": true, "data": { ... } }
```

### Error

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [{ "field": "name", "message": "Required" }]
}
```

### HTTP Status Codes

| Code | When |
|------|------|
| 200 | GET, PUT, DELETE success |
| 201 | POST created |
| 400 | Validation failed / Invalid FK |
| 404 | Record not found (rootid missing or activate=false) |
| 409 | Duplicate record |
| 500 | Internal error |

---

## API Reference

### Health Check

```
GET /api/health → { success: true, data: { status: "ok", timestamp: "..." } }
```

### data_schema — `/api/schemax`

```
GET    /api/schemax                          List all (activate=true)
GET    /api/schemax?flag=published           Filter by flag
GET    /api/schemax?limit=10&offset=0        Pagination
GET    /api/schemax/:rootid                  Get by UUID
GET    /api/schemax/:rootid/history          Version chain
POST   /api/schemax                          Create
PUT    /api/schemax/:rootid                  Update (append-only)
DELETE /api/schemax/:rootid                  Soft delete (tombstone)
```

### view — `/api/viewx`

```
GET    /api/viewx?data_schema_id=1           Views for schema id=1
POST   /api/viewx                            Create
PUT    /api/viewx/:rootid                    Update
```

### form — `/api/formcfgx`

```
GET    /api/formcfgx?data_id=1               Form configs for schema id=1
POST   /api/formcfgx                         Create
PUT    /api/formcfgx/:rootid                 Update
```

### data — `/api/formx`

```
GET    /api/formx?data_schema_id=1            Data records for schema id=1
POST   /api/formx                             Create
PUT    /api/formx/:rootid                     Update
DELETE /api/formx/:rootid                     Soft delete
```

---

## Testing

```bash
npm test  # Jest 30 + supertest — 95 tests, ~2 seconds
```

### Test Coverage

| Group | Count | Tests |
|-------|-------|-------|
| Unit (mock Prisma) | 36 | CRUD per table, validation, response format, column naming |
| Integration (stateful mock) | 59 | Full CRUD flow, pagination, FK filter, soft delete |

---

## Setup & Commands

### Prerequisites

- Node.js 22+
- PostgreSQL 16+

### Install & Run

```bash
npm install
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/rootid"' > .env
npm run prisma:generate
npm run prisma:migrate
npm run dev              # http://localhost:3002
npm test
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Production server |
| `npm run dev` | Dev server (nodemon — auto-reload) |
| `npm test` | Run all tests |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run DB migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

---

## Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| API route | suffix `x` | `/api/schemax`, `/api/viewx` |
| URL param | `rootid` (UUID) | `GET /api/schemax/:rootid` |
| File names | `xxx.controller.js`, `xxx.service.js` | `schemax.controller.js` |
| DB column | snake_case | `data_schema_id`, `json_table_config` |
| Datetime | BigInt 14-digit UTC | `20260422143052` |

---

## Benchmark (at rootid/benchmark/)

Compares execution time + storage: PG Relational vs MongoDB vs PG JSONB.
- Data: Wikipedia revision data (58 categories, 399 pages, 3,657 revisions, 252 MB)
- DB: PostgreSQL 18 (port 5432) + MongoDB 8.2 (port 27017)

```bash
cd rootid/benchmark
npm install && docker compose up -d && npm start  # http://localhost:3003
```

See `benchmark/CLAUDE.md` for full details.
